using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Ewallet.Infrastructure.Identity;

internal interface IJwtTokenGenerator
{
  Task<(string Token, DateTime ExpiresAtUtc)> GenerateAsync(ApplicationUser user);
}

internal sealed class JwtTokenGenerator(IOptions<JwtOptions> jwtOptions, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole<long>> roleManager) : IJwtTokenGenerator
{
  private readonly JwtOptions _jwt = jwtOptions.Value;
  public async Task<(string Token, DateTime ExpiresAtUtc)> GenerateAsync(ApplicationUser user)
  {
    var roles = await userManager.GetRolesAsync(user);
    var userClaims = await userManager.GetClaimsAsync(user);

    var claims = new List<Claim>
    {
        new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new(JwtRegisteredClaimNames.UniqueName, user.UserName ?? string.Empty),
        new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
        new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new(ClaimTypes.NameIdentifier, user.Id.ToString())
    };

    claims.AddRange(userClaims);

    foreach (var roleName in roles)
    {
        claims.Add(new Claim(ClaimTypes.Role, roleName));

        var role = await roleManager.FindByNameAsync(roleName);
        if (role is not null)
        {
            var roleClaims = await roleManager.GetClaimsAsync(role);
            claims.AddRange(roleClaims);
        }
    }

    var distinctClaims = claims
        .GroupBy(c => new { c.Type, c.Value })
        .Select(g => g.First())
        .ToList();

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var expiresAtUtc = DateTime.UtcNow.AddMinutes(_jwt.ExpiryMinutes);

    var token = new JwtSecurityToken(
        issuer: _jwt.Issuer,
        audience: _jwt.Audience,
        claims: distinctClaims,
        expires: expiresAtUtc,
        signingCredentials: credentials);

    return (new JwtSecurityTokenHandler().WriteToken(token), expiresAtUtc);
  }
}