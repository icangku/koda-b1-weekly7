using Ewallet.Application.Dtos.Auth;

namespace Ewallet.Application.Interfaces;

public interface IAuthService 
{
  Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct = default);
  Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default);
  Task<UserProfileDto> GetCurrentUserAsync(long userId, CancellationToken ct = default);
} 