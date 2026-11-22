using Ewallet.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Ewallet.Infrastructure.Identity;

public class ApplicationUser : IdentityUser<long>
{
    public string FullName { get; set; } = null!;
    public UserStatus Status { get; set; } = UserStatus.Active;
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? UpdatedAtUtc { get; set; }
}