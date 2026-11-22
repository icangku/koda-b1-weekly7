using Ewallet.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ewallet.Infrastructure.Persistance.Configurations;

public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
  public void Configure(EntityTypeBuilder<ApplicationUser> b)
  {
    b.ToTable(t => t.HasCheckConstraint("CK_AspNetUsers_Status", "[Status] IN ('ACTIVE', 'SUSPENDED')"));

    b.Property(u => u.FullName).IsRequired().HasMaxLength(100);

    b.HasIndex(u => u.PhoneNumber)
      .IsUnique()
      .HasFilter("[PhoneNumber] IS NOT NULL");
  }
}