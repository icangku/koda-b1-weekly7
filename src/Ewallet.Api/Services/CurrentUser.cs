using System.Security.Claims;
using Ewallet.Application.Interfaces;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Ewallet.Api.Services;

public sealed class CurrentUser(IHttpContextAccessor httpContextAccessor) : ICurrentUser
{
  public long? UserId
  {
    get
    {
      var user = httpContextAccessor.HttpContext?.User;
      var rawId = user?.FindFirstValue(ClaimTypes.NameIdentifier)
                  ?? user?.FindFirstValue(JwtRegisteredClaimNames.Sub);

      return long.TryParse(rawId, out var id) ? id : null;
    }
  }

  public string? CorrelationId => httpContextAccessor.HttpContext?.TraceIdentifier;
  public bool IsAdmin => httpContextAccessor.HttpContext?.User.IsInRole("ADMIN") ?? false;
}