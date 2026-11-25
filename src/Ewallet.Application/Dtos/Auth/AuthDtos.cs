namespace Ewallet.Application.Dtos.Auth;

public record RegisterRequest(string FullName, string UserName, string Email, string PhoneNumber, string Password);
public record LoginRequest (string Identifier, string Password);
public record RefreshTokenRequest(string RefreshToken);
public record UserProfileDto(long Id, string FullName, string UserName, string Email, string? PhoneNumber, string Status, IReadOnlyList<string> Roles, IReadOnlyList<string> Permissions);
public record AuthResponse(string AccessToken, DateTime AccessTokenExpiresAtUtc, string RefreshToken, DateTime RefreshTokenExpiresAtUtc, UserProfileDto User);
public record ClientAuthResponse(string AccessToken, DateTime AccessTokenExpiresAtUtc, UserProfileDto User);
public record UpdateMyProfileRequest(
    string FullName,
    string PhoneNumber);

public record ChangePasswordRequest(
    string CurrentPassword,
    string NewPassword);

public record ForgotPasswordRequest(
    string Email);

public record ForgotPasswordResponse(
    string Message,
    string? ResetToken);

public record ResetPasswordRequest(
    string Email,
    string Token,
    string NewPassword);