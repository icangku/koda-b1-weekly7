namespace Ewallet.Infrastructure.Identity;

public class RefreshToken
{
  public long Id {get; set;}
  public long UserId {get; set;}
  public Guid FamilyId { get; set; }
  public string TokenHash {get; set;} = null!;
  public DateTime ExpiresAtUtc {get; set;}
  public DateTime CreatedAtUtc {get; set;}
  public DateTime? RevokedAtUtc {get; set;}
  public string? ReplacedByTokenHash {get; set;}

  public bool IsExpired => DateTime.UtcNow >= ExpiresAtUtc;
  public bool IsRevoked => RevokedAtUtc is not null;
  public bool IsActive => !IsRevoked && !IsRevoked;
}
