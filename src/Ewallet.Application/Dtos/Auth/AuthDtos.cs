namespace Ewallet.Application.Dtos.Auth;

public record RegisterRequest(string FullName, string UserName, string Email, string PhoneNumber, string Password);

public record LoginRequest (string Identifier, string Password);

public record AuthResponse(string AccessToken, DateTime ExpiresAtUtc, UserProfileDto User);

public record UserProfileDto(long Id, string FullName, string UserName, string Email, string? PhoneNumber, string Status, IReadOnlyList<string> Roles);

