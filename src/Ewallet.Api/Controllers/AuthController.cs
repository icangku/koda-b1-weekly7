using Ewallet.Application.Dtos.Auth;
using Ewallet.Application.Exceptions;
using Ewallet.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ewallet.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService authService, ICurrentUser currentUser) : ControllerBase
{
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request, CancellationToken ct)
    {
        var result = await authService.RegisterAsync(request, ct);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var result = await authService.LoginAsync(request, ct);
        return Ok(result);
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Refresh([FromBody] RefreshTokenRequest request, CancellationToken ct)
    {
        var result = await authService.RefreshAsync(request.RefreshToken, ct);
        return Ok(result);
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout([FromBody] RefreshTokenRequest request, CancellationToken ct)
    {
        await authService.RevokeAsync(request.RefreshToken, ct);
        return NoContent();
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserProfileDto>> Me(CancellationToken ct)
    {
        var userId = currentUser.UserId ?? throw new UnauthorizedException("Token tidak valid.");
        var profile = await authService.GetCurrentUserAsync(userId, ct);
        return Ok(profile);
    }

    [HttpPut("me")]
    [Authorize]
    public async Task<ActionResult<UserProfileDto>> UpdateMe([FromBody] UpdateMyProfileRequest request, CancellationToken ct)
    {
        var userId = currentUser.UserId ?? throw new UnauthorizedException("Token tidak valid.");
        return Ok(await authService.UpdateMyProfileAsync(userId, request, ct));
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request, CancellationToken ct)
    {
        var userId = currentUser.UserId ?? throw new UnauthorizedException("Token tidak valid.");
        await authService.ChangePasswordAsync(userId, request, ct);
        return NoContent();
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<ActionResult<ForgotPasswordResponse>> ForgotPassword([FromBody] ForgotPasswordRequest request, CancellationToken ct)
        => Ok(await authService.ForgotPasswordAsync(request, ct));

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request, CancellationToken ct)
    {
        await authService.ResetPasswordAsync(request, ct);
        return NoContent();
    }
}