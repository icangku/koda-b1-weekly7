using System.ComponentModel.DataAnnotations;
using Ewallet.Domain.Entities;

namespace Ewallet.Application.Dtos.Users;

public record CreateUserRequest(
    [Required, StringLength(50, MinimumLength = 3), RegularExpression("^[a-zA-Z0-9_.]+$", ErrorMessage = "Username hanya boleh huruf, angka, titik, dan underscore.")] string Username,
    [Required, StringLength(100)] string FullName,
    [Required, EmailAddress, StringLength(150)] string Email,
    [Required, Phone, StringLength(20)] string Phone
);

public record UpdateUserRequest(
    [Required, StringLength(100)] string FullName,
    [Required, EmailAddress, StringLength(150)] string Email,
    [Required, Phone, StringLength(20)] string Phone,
    UserStatus? Status = null
);

public record UserResponse(
    long Id,
    string Username,
    string FullName,
    string Email,
    string Phone,
    UserStatus Status,
    long? WalletId,
    string? WalletNumber,
    decimal Balance);

public record UserQuery(
    string? Search = null,
    UserStatus? Status = null,
    int Page = 1,
    int PageSize = 10);

public record PagedUsersResponse(
    IReadOnlyList<UserResponse> Items,
    int TotalCount,
    int ActiveCount,
    int SuspendedCount,
    int Page,
    int PageSize);