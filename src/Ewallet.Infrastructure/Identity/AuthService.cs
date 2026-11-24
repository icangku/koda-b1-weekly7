using Ewallet.Application.Dtos.Auth;
using Ewallet.Application.Exceptions;
using Ewallet.Application.Interfaces;
using Ewallet.Application.Services;
using Ewallet.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Hosting;

namespace Ewallet.Infrastructure.Identity;

internal sealed class AuthService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    IWalletRepository wallets,
    IAuditLogService audit,
    IUnitOfWork uow,
    IJwtTokenGenerator jwtGenerator,
    IRefreshTokenService refreshTokens,
    RoleManager<IdentityRole<long>> roleManager,
    IUserRepository users,
    IHostEnvironment env) : IAuthService
{
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        var user = new ApplicationUser
        {
            FullName = request.FullName.Trim(),
            UserName = request.UserName.Trim(),
            Email = request.Email.Trim(),
            PhoneNumber = string.IsNullOrWhiteSpace(request.PhoneNumber) ? null : request.PhoneNumber.Trim(),
            Status = UserStatus.Active,
            CreatedAtUtc = now
        };

        await using var dbTx = await uow.BeginTransactionAsync(ct);

        var createResult = await userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
        {
            var errors = string.Join("; ", createResult.Errors.Select(e => e.Description));
            throw new WalletException(errors);
        }

        var roleResult = await userManager.AddToRoleAsync(user, "CUSTOMER");
        if (!roleResult.Succeeded)
        {
            var errors = string.Join("; ", roleResult.Errors.Select(e => e.Description));
            throw new WalletException(errors);
        }

        var wallet = new Wallet
        {
            UserId = user.Id,
            WalletNumber = $"EW{1_000_000_000L + user.Id}",
            Balance = 0m,
            Status = WalletStatus.Active,
            CreatedAtUtc = now
        };

        wallets.Add(wallet);
        await uow.SaveChangesAsync(ct);

        audit.Record(new AuditEntry(
            Action: "USER_REGISTERED",
            Outcome: AuditOutcome.Success,
            EntityType: nameof(ApplicationUser),
            EntityId: user.Id.ToString(),
            ActorUserId: user.Id,
            TransactionId: null,
            Description: $"Akun {user.UserName} terdaftar dengan wallet {wallet.WalletNumber}."));

        await uow.SaveChangesAsync(ct);
        await dbTx.CommitAsync(ct);

        var (accessToken, accessExpiresAtUtc) = await jwtGenerator.GenerateAsync(user);
        var (refreshToken, refreshExpiresAtUtc) = await refreshTokens.IssueAsync(user.Id, ct);
        var profile = await MapProfileAsync(user);

        return new AuthResponse(accessToken, accessExpiresAtUtc, refreshToken, refreshExpiresAtUtc, profile);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var identifier = request.Identifier.Trim();
        var user = identifier.Contains('@')
            ? await userManager.FindByEmailAsync(identifier)
            : await userManager.FindByNameAsync(identifier);

        if (user is null)
            throw new UnauthorizedException("Email/username atau password salah.");

        if (user.Status != UserStatus.Active)
            throw new WalletInactiveException("Akun tidak aktif atau sedang ditangguhkan.");

        var signInResult = await signInManager.CheckPasswordSignInAsync(
            user,
            request.Password,
            lockoutOnFailure: true);

        if (signInResult.IsLockedOut)
            throw new UnauthorizedException("Akun terkunci sementara karena terlalu banyak percobaan gagal. Coba lagi nanti.");

        if (!signInResult.Succeeded)
            throw new UnauthorizedException("Email/username atau password salah.");

        var (accessToken, accessExpiresAtUtc) = await jwtGenerator.GenerateAsync(user);
        var (refreshToken, refreshExpiresAtUtc) = await refreshTokens.IssueAsync(user.Id, ct);
        var profile = await MapProfileAsync(user);

        return new AuthResponse(accessToken, accessExpiresAtUtc, refreshToken, refreshExpiresAtUtc, profile);
    }

    public async Task<AuthResponse> RefreshAsync(string refreshToken, CancellationToken ct = default)
    {
        var (userId, newRefreshToken, newRefreshExpiresAtUtc) = await refreshTokens.RotateAsync(refreshToken, ct);

        var user = await userManager.FindByIdAsync(userId.ToString())
            ?? throw new UnauthorizedException("Pengguna tidak ditemukan.");

        if (user.Status != UserStatus.Active)
            throw new WalletInactiveException("Akun tidak aktif atau sedang ditangguhkan.");

        var (newAccessToken, newAccessExpiresAtUtc) = await jwtGenerator.GenerateAsync(user);
        var profile = await MapProfileAsync(user);

        return new AuthResponse(newAccessToken, newAccessExpiresAtUtc, newRefreshToken, newRefreshExpiresAtUtc, profile);
    }

    public Task RevokeAsync(string refreshToken, CancellationToken ct = default)
        => refreshTokens.RevokeAsync(refreshToken, ct);

    public async Task<UserProfileDto> GetCurrentUserAsync(long userId, CancellationToken ct = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString())
            ?? throw new UserNotFoundException();

        return await MapProfileAsync(user);
    }

    private async Task<UserProfileDto> MapProfileAsync(ApplicationUser user)
    {
        var roles = (await userManager.GetRolesAsync(user)).ToArray();
        var userClaims = await userManager.GetClaimsAsync(user);

        var permissions = new HashSet<string>(
            userClaims.Where(c => c.Type == "permission").Select(c => c.Value));

        foreach (var roleName in roles)
        {
            var role = await roleManager.FindByNameAsync(roleName);
            if (role is null) continue;

            var roleClaims = await roleManager.GetClaimsAsync(role);
            foreach (var claim in roleClaims.Where(c => c.Type == "permission"))
            {
                permissions.Add(claim.Value);
            }
        }

        return new UserProfileDto(
            user.Id,
            user.FullName,
            user.UserName ?? string.Empty,
            user.Email ?? string.Empty,
            user.PhoneNumber,
            user.Status.ToString().ToUpperInvariant(),
            roles,
            permissions.ToArray());
    }

    public async Task<UserProfileDto> UpdateMyProfileAsync(long userId, UpdateMyProfileRequest request, CancellationToken ct = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString())
            ?? throw new UserNotFoundException();

        var phone = request.PhoneNumber.Trim();
        if (await users.PhoneExistsAsync(phone, userId, ct))
            throw new ConflictException("Nomor telepon sudah digunakan.");

        user.FullName = request.FullName.Trim();
        user.PhoneNumber = phone;
        user.UpdatedAtUtc = DateTime.UtcNow;

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
            throw new WalletException(string.Join("; ", result.Errors.Select(e => e.Description)));

        return await MapProfileAsync(user);
    }

    public async Task ChangePasswordAsync(long userId, ChangePasswordRequest request, CancellationToken ct = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString())
            ?? throw new UserNotFoundException();

        var result = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
        if (!result.Succeeded)
            throw new WalletException(string.Join("; ", result.Errors.Select(e => e.Description)));

        await refreshTokens.RevokeAllForUserAsync(user.Id, ct);

        audit.Record(new AuditEntry(
            Action: "PASSWORD_CHANGED",
            Outcome: AuditOutcome.Success,
            EntityType: nameof(ApplicationUser),
            EntityId: user.Id.ToString(),
            ActorUserId: user.Id,
            TransactionId: null,
            Description: $"Pengguna {user.UserName} mengubah kata sandi."));
        await uow.SaveChangesAsync(ct);
    }

    public async Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request, CancellationToken ct = default)
    {
        const string genericMessage = "Jika email terdaftar, instruksi reset kata sandi telah dibuat.";
        var user = await userManager.FindByEmailAsync(request.Email.Trim());

        // Jangan bocorkan apakah email terdaftar atau tidak di environment Production
        if (user is null)
            return new ForgotPasswordResponse(genericMessage, null);

        var token = await userManager.GeneratePasswordResetTokenAsync(user);

        return new ForgotPasswordResponse(
            genericMessage,
            env.IsDevelopment() ? token : null);
    }

    public async Task ResetPasswordAsync(ResetPasswordRequest request, CancellationToken ct = default)
    {
        var user = await userManager.FindByEmailAsync(request.Email.Trim())
            ?? throw new WalletException("Token reset tidak valid atau sudah kedaluwarsa.");

        var result = await userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
        if (!result.Succeeded)
            throw new WalletException(string.Join("; ", result.Errors.Select(e => e.Description)));

        await refreshTokens.RevokeAllForUserAsync(user.Id, ct);

        audit.Record(new AuditEntry(
            Action: "PASSWORD_RESET",
            Outcome: AuditOutcome.Success,
            EntityType: nameof(ApplicationUser),
            EntityId: user.Id.ToString(),
            ActorUserId: user.Id,
            TransactionId: null,
            Description: $"Kata sandi akun {user.UserName} berhasil di-reset."));
        await uow.SaveChangesAsync(ct);
    }
}