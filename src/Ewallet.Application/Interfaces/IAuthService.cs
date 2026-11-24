using Ewallet.Application.Dtos.Auth;

namespace Ewallet.Application.Interfaces;

public interface IAuthService 
{
  Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct = default);
  Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default);
  Task<AuthResponse> RefreshAsync(string refreshToken, CancellationToken ct = default);
  Task RevokeAsync(string refreshToken, CancellationToken ct = default);
  Task<UserProfileDto> GetCurrentUserAsync(long userId, CancellationToken ct = default);
  Task<UserProfileDto> UpdateMyProfileAsync(long userId, UpdateMyProfileRequest request, CancellationToken ct = default);
  Task ChangePasswordAsync(long userId, ChangePasswordRequest request, CancellationToken ct = default);
  Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request, CancellationToken ct = default);
  Task ResetPasswordAsync(ResetPasswordRequest request, CancellationToken ct = default);
} 