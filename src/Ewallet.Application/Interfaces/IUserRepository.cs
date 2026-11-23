using System;
using Ewallet.Application.Dtos.Users;
using Ewallet.Domain.Entities;

namespace Ewallet.Application.Interfaces;

public interface IUserRepository
{
    // Task<User?> GetByIdAsync(long id, CancellationToken ct = default);
    Task<bool> UsernameExistsAsync(string username, CancellationToken ct = default);
    Task<bool> EmailExistsAsync(string email, long? excludeUserId = null, CancellationToken ct = default);
    Task<bool> PhoneExistsAsync(string phone, long? excludeUserId = null, CancellationToken ct = default);
    // void Add(User user);

    Task<List<UserResponse>> GetAllAsync(CancellationToken ct = default);
    Task<UserResponse?> GetResponseByIdAsync(long id, CancellationToken ct = default);
}