using Ewallet.Domain.Entities;
using Ewallet.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ewallet.Infrastructure.Persistance.Configurations;

public class WalletConfiguration : IEntityTypeConfiguration<Wallet>
{
  public void Configure(EntityTypeBuilder<Wallet> b)
  {
    b.ToTable(t =>
    {
      t.HasCheckConstraint("CK_Wallets_Balance", "[Balance] >= 0");
      t.HasCheckConstraint("CK_Wallets_Status", "[Status] IN ('ACTIVE', 'FROZEN', 'CLOSED')");
    });

    b.Property(w => w.WalletNumber).IsRequired().HasMaxLength(30);
    b.Property(w => w.RowVersion).IsRowVersion();

    b.HasIndex(w => w.WalletNumber).IsUnique();

    b.HasOne<ApplicationUser>()
      .WithOne()
      .HasForeignKey<Wallet>(w => w.UserId)
      .OnDelete(DeleteBehavior.Restrict);
  }
}
