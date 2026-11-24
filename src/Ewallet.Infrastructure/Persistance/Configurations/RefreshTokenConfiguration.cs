using System;
using Ewallet.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ewallet.Infrastructure.Persistance.Configurations;

internal sealed class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
  public void Configure(EntityTypeBuilder<RefreshToken> b)
  {
    b.ToTable("RefreshTokens");
    b.HasKey(rt => rt.Id);

    b.Property(rt => rt.TokenHash).IsRequired().HasMaxLength(128).IsUnicode(false);
    b.Property(rt => rt.ReplacedByTokenHash).HasMaxLength(128).IsUnicode(false);

    b.HasIndex(rt => rt.TokenHash).IsUnique();
    b.HasIndex(rt => rt.UserId);

    b.Property(rt => rt.FamilyId).IsRequired();
    b.HasIndex(rt => rt.FamilyId);

    b.HasOne<ApplicationUser>()
        .WithMany()
        .HasForeignKey(rt => rt.UserId)
        .OnDelete(DeleteBehavior.Cascade);
  }
}
