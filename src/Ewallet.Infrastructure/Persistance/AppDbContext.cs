using Ewallet.Domain.Entities;
using Ewallet.Infrastructure.Identity;
using Ewallet.Infrastructure.Persistance;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Infrastructure.Persistance;

public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole<long>, long>
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}

  // public DbSet<User> Users => Set<User>();
  public DbSet<Wallet> Wallets => Set<Wallet>();
  public DbSet<Transaction> Transactions => Set<Transaction>();
  public DbSet<WalletMutation> WalletMutations => Set<WalletMutation>();
  public DbSet<PaymentMethod> PaymentMethods => Set<PaymentMethod>();
  public DbSet<TopUpRequest> TopUpRequests => Set<TopUpRequest>();
  public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
  public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

  protected override void OnModelCreating(ModelBuilder modelBuilder) {
    base.OnModelCreating(modelBuilder); 
    modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
  }
  protected override void ConfigureConventions(ModelConfigurationBuilder cb)
  {
    cb.Properties<UserStatus>().HaveConversion<UpperCaseEnumConverter<UserStatus>>().HaveMaxLength(20).AreUnicode(false);
    cb.Properties<WalletStatus>().HaveConversion<UpperCaseEnumConverter<WalletStatus>>().HaveMaxLength(20).AreUnicode(false);
    cb.Properties<TransactionType>().HaveConversion<UpperCaseEnumConverter<TransactionType>>().HaveMaxLength(20).AreUnicode(false);
    cb.Properties<TransactionStatus>().HaveConversion<UpperCaseEnumConverter<TransactionStatus>>().HaveMaxLength(20).AreUnicode(false);
    cb.Properties<MutationDirection>().HaveConversion<UpperCaseEnumConverter<MutationDirection>>().HaveMaxLength(3).AreUnicode(false);
    cb.Properties<TopUpStatus>().HaveConversion<UpperCaseEnumConverter<TopUpStatus>>().HaveMaxLength(20).AreUnicode(false);
    cb.Properties<AuditOutcome>().HaveConversion<UpperCaseEnumConverter<AuditOutcome>>().HaveMaxLength(20).AreUnicode(false);

    cb.Properties<decimal>().HavePrecision(18, 2);
  }
}