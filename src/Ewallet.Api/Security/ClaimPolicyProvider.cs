using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace Ewallet.Api.Security;

public sealed class ClaimPolicyProvider(IOptions<AuthorizationOptions> options) : DefaultAuthorizationPolicyProvider(options)
{
  public override async Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
  {
    var existing = await base.GetPolicyAsync(policyName);
    if(existing is not null) return existing;

    return new AuthorizationPolicyBuilder()
      .RequireAuthenticatedUser()
      .RequireClaim("permission", policyName)
      .Build();
  }
}
