using System.Security.Cryptography;
using System.Text;
using Ewallet.Application.Exceptions;
using Ewallet.Application.Interfaces;
using Ewallet.Infrastructure.Persistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Ewallet.Infrastructure.Identity;

internal sealed class RefreshTokenService(AppDbContext db, IOptions<JwtOptions> jwtOptions) : IRefreshTokenService
{
    private readonly JwtOptions _jwt = jwtOptions.Value;

    public async Task<(string RawToken, DateTime ExpiresAtUtc)> IssueAsync(long userId, CancellationToken ct = default)
    {
        var rawToken = GenerateSecureToken();
        var now = DateTime.UtcNow;
        var expiresAt = now.AddDays(_jwt.RefreshTokenExpiryDays);

        db.RefreshTokens.Add(new RefreshToken
        {
            UserId = userId,
            FamilyId = Guid.NewGuid(),
            TokenHash = HashToken(rawToken),
            CreatedAtUtc = now,
            ExpiresAtUtc = expiresAt
        });

        await db.SaveChangesAsync(ct);
        return (rawToken, expiresAt);
    }

    public async Task<(long UserId, string NewRawToken, DateTime NewExpiresAtUtc)> RotateAsync(string rawToken, CancellationToken ct = default)
    {
        var hash = HashToken(rawToken);
        var existing = await db.RefreshTokens.FirstOrDefaultAsync(rt => rt.TokenHash == hash, ct)
            ?? throw new UnauthorizedException("Refresh token tidak valid.");

        if (existing.IsRevoked)
        {
            var familyTokens = await db.RefreshTokens
                .Where(rt => rt.FamilyId == existing.FamilyId && rt.RevokedAtUtc == null)
                .ToListAsync(ct);

            foreach (var token in familyTokens)
                token.RevokedAtUtc = DateTime.UtcNow;

            await db.SaveChangesAsync(ct);
            throw new UnauthorizedException("Refresh token sudah tidak berlaku. Silakan login ulang.");
        }

        if (existing.IsExpired)
            throw new UnauthorizedException("Refresh token sudah kedaluwarsa. Silakan login ulang.");

        var now = DateTime.UtcNow;
        var newRawToken = GenerateSecureToken();
        var newHash = HashToken(newRawToken);
        var newExpiresAt = now.AddDays(_jwt.RefreshTokenExpiryDays);

        existing.RevokedAtUtc = now;
        existing.ReplacedByTokenHash = newHash;

        db.RefreshTokens.Add(new RefreshToken
        {
            UserId = existing.UserId,
            FamilyId = existing.FamilyId, // Pertahankan FamilyId yang sama dalam satu rantai rotasi
            TokenHash = newHash,
            CreatedAtUtc = now,
            ExpiresAtUtc = newExpiresAt
        });

        await db.SaveChangesAsync(ct);
        return (existing.UserId, newRawToken, newExpiresAt);
    }
    public async Task RevokeAsync(string rawToken, CancellationToken ct = default)
    {
        var hash = HashToken(rawToken);
        var existing = await db.RefreshTokens.FirstOrDefaultAsync(rt => rt.TokenHash == hash, ct);
        if (existing is null || existing.IsRevoked) return;

        existing.RevokedAtUtc = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
    }

    private static string GenerateSecureToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes);
    }

    private static string HashToken(string rawToken)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(rawToken));
        return Convert.ToHexString(bytes);
    }

    public async Task RevokeAllForUserAsync(long userId, CancellationToken ct = default)
    {
        var activeTokens = await db.RefreshTokens
            .Where(rt => rt.UserId == userId && rt.RevokedAtUtc == null)
            .ToListAsync(ct);

        if (activeTokens.Count == 0) return;

        var now = DateTime.UtcNow;
        foreach (var token in activeTokens)
            token.RevokedAtUtc = now;

        await db.SaveChangesAsync(ct);
    }
}