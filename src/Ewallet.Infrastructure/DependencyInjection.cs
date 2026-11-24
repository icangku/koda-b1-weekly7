using Ewallet.Application.Interfaces;
using Ewallet.Infrastructure.Identity;
using Ewallet.Infrastructure.Persistance;
using Ewallet.Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Ewallet.Infrastructure;

public static class DependencyInjection
{
  public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
  {
    var connectionString = configuration.GetConnectionString("Default") ?? throw new InvalidOperationException("Connection string not available");
    services.AddDbContext<AppDbContext>(o => o.UseSqlServer(connectionString));
    services.AddScoped<IUnitOfWork, UnitOfWork>();
    services.AddScoped<IWalletRepository, WalletRepository>();
    services.AddScoped<IPaymentMethodRepository, PaymentMethodRepository>();
    services.AddScoped<ITransactionRepository, TransactionRepository>();
    services.AddScoped<ITopUpRequestRepository, TopUpRequestRepository>();
    services.AddScoped<IWalletMutationRepository, WalletMutationRepository>();
    services.AddScoped<IAuditLogRepository, AuditLogRepository>();
    services.AddScoped<IUserRepository, UserRepository>();
    services.AddScoped<IRefreshTokenService, RefreshTokenService>();
    services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
    services.AddScoped<IAuthService, AuthService>();
    services.AddDataProtection();
    services.AddIdentityCore<ApplicationUser>(options =>
    {
      options.User.RequireUniqueEmail = true;
      options.Password.RequiredLength = 8;
      options.Password.RequireDigit = true;
      options.Password.RequireLowercase = true;
      options.Password.RequireUppercase = true;
      options.Password.RequireNonAlphanumeric = true;

      options.Lockout.MaxFailedAccessAttempts = 5;
      options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    })
    .AddRoles<IdentityRole<long>>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddSignInManager()
    .AddDefaultTokenProviders();

    services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));
    
    return services;
  }
}
