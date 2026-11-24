using Ewallet.Application.Dtos.Users;
using Ewallet.Application.Exceptions;
using Ewallet.Application.Interfaces;
using Ewallet.Domain.Entities;

namespace Ewallet.Application.Services;

public interface IUserService
{
    Task<PagedUsersResponse> GetAllAsync(UserQuery query, CancellationToken ct = default);
    Task<UserResponse> GetByIdAsync(long id, CancellationToken ct = default);
    Task UpdateAsync(long id, UpdateUserRequest request, CancellationToken ct = default);
}

public class UserService(
    IUserRepository users,
    IAuditLogService audit,
    IRefreshTokenService refreshTokens,
    ICurrentUser currentUser,
    IUnitOfWork uow) : IUserService
{
    public Task<PagedUsersResponse> GetAllAsync(UserQuery query, CancellationToken ct = default)
        => users.GetAllAsync(query, ct);

    public async Task<UserResponse> GetByIdAsync(long id, CancellationToken ct = default)
        => await users.GetResponseByIdAsync(id, ct) ?? throw new UserNotFoundException();

    public async Task UpdateAsync(long id, UpdateUserRequest request, CancellationToken ct = default)
    {
        var existing = await users.GetResponseByIdAsync(id, ct) ?? throw new UserNotFoundException();

        var email = request.Email.Trim().ToLowerInvariant();
        var phone = request.Phone.Trim();

        if (await users.EmailExistsAsync(email, id, ct))
            throw new ConflictException("Email sudah digunakan.");
        if (await users.PhoneExistsAsync(phone, id, ct))
            throw new ConflictException("Nomor telepon sudah digunakan.");

        var updated = await users.UpdateProfileAsync(
            id,
            request.FullName.Trim(),
            email,
            phone,
            request.Status,
            ct);

        if (!updated) throw new UserNotFoundException();

        // Jika status berubah (mis. ACTIVE -> SUSPENDED), catat audit log & cabut sesi user
        if (request.Status.HasValue && request.Status.Value != existing.Status)
        {
            var newStatus = request.Status.Value;
            if (newStatus == UserStatus.Suspended)
            {
                await refreshTokens.RevokeAllForUserAsync(id, ct);
            }

            audit.Record(new AuditEntry(
                Action: newStatus == UserStatus.Suspended ? "USER_SUSPENDED" : "USER_ACTIVATED",
                Outcome: AuditOutcome.Success,
                EntityType: "ApplicationUser",
                EntityId: id.ToString(),
                ActorUserId: currentUser.UserId,
                TransactionId: null,
                Description: $"Admin mengubah status akun {existing.Username} menjadi {newStatus.ToString().ToUpperInvariant()}."));
        }

        await uow.SaveChangesAsync(ct);
    }
}