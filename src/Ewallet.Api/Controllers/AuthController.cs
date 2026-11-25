using Ewallet.Application.Dtos.Auth;
using Ewallet.Application.Exceptions;
using Ewallet.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Ewallet.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService authService, ICurrentUser currentUser) : ControllerBase
{
    private const string RefreshTokenCookieName = "refreshToken";

    private void SetRefreshTokenCookie(string refreshToken, DateTime expiresAtUtc)
    {
        Response.Cookies.Append(RefreshTokenCookieName, refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Strict,
            Path = "/api/auth",
            Expires = new DateTimeOffset(expiresAtUtc, TimeSpan.Zero)
        });
    }

    private void DeleteRefreshTokenCookie()
    {
        Response.Cookies.Delete(RefreshTokenCookieName, new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Strict,
            Path = "/api/auth"
        });
    }

    [HttpPost("register")]
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    public async Task<ActionResult<ClientAuthResponse>> Register([FromBody] RegisterRequest request, CancellationToken ct)
    {
        var result = await authService.RegisterAsync(request, ct);
        SetRefreshTokenCookie(result.RefreshToken, result.RefreshTokenExpiresAtUtc);
        return StatusCode(StatusCodes.Status201Created, new ClientAuthResponse(result.AccessToken, result.AccessTokenExpiresAtUtc, result.User));
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    public async Task<ActionResult<ClientAuthResponse>> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var result = await authService.LoginAsync(request, ct);
        SetRefreshTokenCookie(result.RefreshToken, result.RefreshTokenExpiresAtUtc);
        return Ok(new ClientAuthResponse(result.AccessToken, result.AccessTokenExpiresAtUtc, result.User));
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    public async Task<ActionResult<ClientAuthResponse>> Refresh(CancellationToken ct)
    {
        var refreshToken = Request.Cookies[RefreshTokenCookieName];
        if (string.IsNullOrWhiteSpace(refreshToken))
        {
            DeleteRefreshTokenCookie();
            throw new UnauthorizedException("Refresh token tidak ditemukan.");
        }

        try
        {
            var result = await authService.RefreshAsync(refreshToken, ct);
            SetRefreshTokenCookie(result.RefreshToken, result.RefreshTokenExpiresAtUtc);
            return Ok(new ClientAuthResponse(result.AccessToken, result.AccessTokenExpiresAtUtc, result.User));
        }
        catch (UnauthorizedException)
        {
            DeleteRefreshTokenCookie();
            throw;
        }
    }

    [HttpPost("logout")]
    [AllowAnonymous]
    public async Task<IActionResult> Logout(CancellationToken ct)
    {
        var refreshToken = Request.Cookies[RefreshTokenCookieName];
        if (!string.IsNullOrWhiteSpace(refreshToken))
        {
            await authService.RevokeAsync(refreshToken, ct);
        }

        DeleteRefreshTokenCookie();
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
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request, CancellationToken ct)
    {
        var userId = currentUser.UserId ?? throw new UnauthorizedException("Token tidak valid.");
        await authService.ChangePasswordAsync(userId, request, ct);
        return NoContent();
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    public async Task<ActionResult<ForgotPasswordResponse>> ForgotPassword([FromBody] ForgotPasswordRequest request, CancellationToken ct)
        => Ok(await authService.ForgotPasswordAsync(request, ct));

    [HttpPost("reset-password")]
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request, CancellationToken ct)
    {
        await authService.ResetPasswordAsync(request, ct);
        return NoContent();
    }
}