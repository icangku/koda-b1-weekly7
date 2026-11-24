using Ewallet.Application.Dtos.Users;
using Ewallet.Application.Interfaces;
using Ewallet.Domain.Entities;
using Ewallet.Infrastructure.Persistance;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Infrastructure.Repositories;

public class UserRepository(AppDbContext db) : IUserRepository
{
    public Task<bool> UsernameExistsAsync(string username, CancellationToken ct = default)
        => db.Users.AnyAsync(u => u.UserName == username, ct);

    public Task<bool> EmailExistsAsync(string email, long? excludeUserId = null, CancellationToken ct = default)
        => db.Users.AnyAsync(u => u.Email == email && (excludeUserId == null || u.Id != excludeUserId), ct);

    public Task<bool> PhoneExistsAsync(string phone, long? excludeUserId = null, CancellationToken ct = default)
        => db.Users.AnyAsync(u => u.PhoneNumber == phone && (excludeUserId == null || u.Id != excludeUserId), ct);

  public async Task<PagedUsersResponse> GetAllAsync(UserQuery query, CancellationToken ct = default)
  {
    var page = Math.Max(1, query.Page);
    var pageSize = Math.Clamp(query.PageSize, 1, 100);

    var totalCount = await db.Users.AsNoTracking().CountAsync(ct);
    var activeCount = await db.Users.AsNoTracking().CountAsync(u => u.Status == UserStatus.Active, ct);
    var suspendedCount = totalCount - activeCount;

    var usersQuery = db.Users.AsNoTracking().AsQueryable();

    if (!string.IsNullOrWhiteSpace(query.Search))
    {
        var term = query.Search.Trim().ToLower();
        usersQuery = usersQuery.Where(u =>
            u.FullName.ToLower().Contains(term) ||
            (u.UserName != null && u.UserName.ToLower().Contains(term)) ||
            (u.Email != null && u.Email.ToLower().Contains(term)));
    }

    if (query.Status.HasValue)
    {
        usersQuery = usersQuery.Where(u => u.Status == query.Status.Value);
    }

    var filteredCount = await usersQuery.CountAsync(ct);

    var items = await (
        from u in usersQuery
        join w in db.Wallets.AsNoTracking() on u.Id equals w.UserId into wg
        from w in wg.DefaultIfEmpty()
        orderby u.Id descending
        select new UserResponse(
            u.Id,
            u.UserName ?? string.Empty,
            u.FullName,
            u.Email ?? string.Empty,
            u.PhoneNumber ?? string.Empty,
            u.Status,
            w != null ? w.Id : null,
            w != null ? w.WalletNumber : null,
            w != null ? w.Balance : 0m))
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync(ct);

    return new PagedUsersResponse(items, filteredCount, activeCount, suspendedCount, page, pageSize);
  }

    public Task<UserResponse?> GetResponseByIdAsync(long id, CancellationToken ct = default)
        => (from u in db.Users.AsNoTracking()
            where u.Id == id
            join w in db.Wallets.AsNoTracking() on u.Id equals w.UserId into wg
            from w in wg.DefaultIfEmpty()
            select new UserResponse(
                u.Id,
                u.UserName ?? string.Empty,
                u.FullName,
                u.Email ?? string.Empty,
                u.PhoneNumber ?? string.Empty,
                u.Status,
                w != null ? w.Id : null,
                w != null ? w.WalletNumber : null,
                w != null ? w.Balance : 0m))
            .FirstOrDefaultAsync(ct);

    public Task<UserStatus?> GetStatusByIdAsync(long userId, CancellationToken ct = default)
        => db.Users.AsNoTracking()
            .Where(u => u.Id == userId)
            .Select(u => (UserStatus?)u.Status)
            .FirstOrDefaultAsync(ct);

    public async Task<bool> UpdateProfileAsync(
        long id,
        string fullName,
        string email,
        string phone,
        UserStatus? status,
        CancellationToken ct = default)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id, ct);
        if (user is null) return false;

        user.FullName = fullName;
        user.Email = email;
        user.NormalizedEmail = email.ToUpperInvariant();
        user.PhoneNumber = phone;
        if (status.HasValue) user.Status = status.Value;
        user.UpdatedAtUtc = DateTime.UtcNow;

        return true;
    }
}