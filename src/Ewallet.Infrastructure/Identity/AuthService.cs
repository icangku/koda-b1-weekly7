using Ewallet.Application.Dtos.Auth;
using Ewallet.Application.Exceptions;
using Ewallet.Application.Interfaces;
using Ewallet.Application.Services;
using Ewallet.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Ewallet.Infrastructure.Identity;

internal sealed class AuthService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    IWalletRepository wallets,
    IAuditLogService audit,
    IUnitOfWork uow,
    IJwtTokenGenerator jwtGenerator) : IAuthService
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

        var roles = new[] { "CUSTOMER" };
        var (token, expiresAtUtc) = jwtGenerator.Generate(user, roles);

        return new AuthResponse(token, expiresAtUtc, MapProfile(user, roles));
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var identifier = request.Identifier.Trim();
        var user = identifier.Contains('@')
            ? await userManager.FindByEmailAsync(identifier)
            : await userManager.FindByNameAsync(identifier);

        if (user is null)
            throw new WalletException("Email/username atau password salah.");

        if (user.Status != UserStatus.Active)
            throw new WalletInactiveException("Akun tidak aktif atau sedang ditangguhkan.");

        var signInResult = await signInManager.CheckPasswordSignInAsync(
            user,
            request.Password,
            lockoutOnFailure: true);

        if (signInResult.IsLockedOut)
            throw new WalletException("Akun terkunci sementara karena terlalu banyak percobaan gagal. Coba lagi nanti.");

        if (!signInResult.Succeeded)
            throw new WalletException("Email/username atau password salah.");

        var roles = (await userManager.GetRolesAsync(user)).ToArray();
        var (token, expiresAtUtc) = jwtGenerator.Generate(user, roles);

        return new AuthResponse(token, expiresAtUtc, MapProfile(user, roles));
    }

    public async Task<UserProfileDto> GetCurrentUserAsync(long userId, CancellationToken ct = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString())
            ?? throw new UserNotFoundException();

        var roles = (await userManager.GetRolesAsync(user)).ToArray();
        return MapProfile(user, roles);
    }

    private static UserProfileDto MapProfile(ApplicationUser user, IReadOnlyList<string> roles) => new(
        user.Id,
        user.FullName,
        user.UserName ?? string.Empty,
        user.Email ?? string.Empty,
        user.PhoneNumber,
        user.Status.ToString().ToUpperInvariant(),
        roles);
}