namespace Ewallet.Application.Interfaces;

public interface IRefreshTokenService
{
    Task<(string RawToken, DateTime ExpiresAtUtc)> IssueAsync(long userId, CancellationToken ct = default);
    Task<(long UserId, string NewRawToken, DateTime NewExpiresAtUtc)> RotateAsync(string rawToken, CancellationToken ct = default);
    Task RevokeAsync(string rawToken, CancellationToken ct = default);
    Task RevokeAllForUserAsync(long userId, CancellationToken ct = default);
}
