using Ewallet.Application.Dtos.Users;
using Ewallet.Domain.Entities;

namespace Ewallet.Application.Interfaces;

public interface IUserRepository
{
    Task<bool> UsernameExistsAsync(string username, CancellationToken ct = default);
    Task<bool> EmailExistsAsync(string email, long? excludeUserId = null, CancellationToken ct = default);
    Task<bool> PhoneExistsAsync(string phone, long? excludeUserId = null, CancellationToken ct = default);
    Task<UserStatus?> GetStatusByIdAsync(long userId, CancellationToken ct = default);
    Task<bool> UpdateProfileAsync(long id, string fullName, string email, string phone, UserStatus? status, CancellationToken ct = default);
    Task<PagedUsersResponse> GetAllAsync(UserQuery query, CancellationToken ct = default);
    Task<UserResponse?> GetResponseByIdAsync(long id, CancellationToken ct = default);
}