using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Ewallet.Infrastructure.Identity;

internal interface IJwtTokenGenerator
{
  (string Token, DateTime ExpiresAtUtc) Generate(ApplicationUser user, IEnumerable<string> roles);
}

internal sealed class JwtTokenGenerator(IConfiguration config) : IJwtTokenGenerator
{
  public (string Token, DateTime ExpiresAtUtc) Generate(ApplicationUser user, IEnumerable<string> roles)
  {
    var issuer = config["Jwt:Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer belum dikonfigurasi.");
    var audience = config["Jwt:Audience"] ?? throw new InvalidOperationException("Jwt:Audience belum dikonfigurasi.");
    var secretKey = config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key belum dikonfigurasi.");
    var expiryMinutes = int.TryParse(config["Jwt:ExpiryMinutes"], out var mins) ? mins : 60;

    var claims = new List<Claim>
    {
      new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
      new(JwtRegisteredClaimNames.UniqueName, user.UserName ?? string.Empty),
      new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
      new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
      new(ClaimTypes.NameIdentifier, user.Id.ToString())
    };

    foreach (var role in roles)
    {
        claims.Add(new Claim(ClaimTypes.Role, role));
    }

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var expiresAtUtc = DateTime.UtcNow.AddMinutes(expiryMinutes);

    var token = new JwtSecurityToken(
        issuer: issuer,
        audience: audience,
        claims: claims,
        expires: expiresAtUtc,
        signingCredentials: credentials);

    return (new JwtSecurityTokenHandler().WriteToken(token), expiresAtUtc);
  }
}