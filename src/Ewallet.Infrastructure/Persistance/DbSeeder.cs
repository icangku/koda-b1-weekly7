using Ewallet.Application.Utils;
using Ewallet.Domain.Entities;
using Ewallet.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Ewallet.Infrastructure.Persistance;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var sp = scope.ServiceProvider;

        var db = sp.GetRequiredService<AppDbContext>();
        var roleManager = sp.GetRequiredService<RoleManager<IdentityRole<long>>>();
        var userManager = sp.GetRequiredService<UserManager<ApplicationUser>>();
        var config = sp.GetRequiredService<IConfiguration>();

        // 1. Seed Roles (ADMIN & CUSTOMER)
        string[] roles = ["CUSTOMER", "ADMIN"];
        foreach (var roleName in roles)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole<long>(roleName));
            }
        }

        // 2. Seed Akun Admin dari konfigurasi (user-secrets / env var)
        var adminEmail = config["AdminSeed:Email"];
        var adminPassword = config["AdminSeed:Password"];
        if (!string.IsNullOrWhiteSpace(adminEmail) && !string.IsNullOrWhiteSpace(adminPassword))
        {
            var existingAdmin = await userManager.FindByEmailAsync(adminEmail);
            if (existingAdmin is null)
            {
                var admin = new ApplicationUser
                {
                    FullName = config["AdminSeed:FullName"] ?? "Super Admin",
                    UserName = config["AdminSeed:UserName"] ?? "admin",
                    Email = adminEmail,
                    EmailConfirmed = true,
                    Status = UserStatus.Active,
                    CreatedAtUtc = DateTime.UtcNow
                };

                var adminResult = await userManager.CreateAsync(admin, adminPassword);
                if (!adminResult.Succeeded)
                {
                    var err = string.Join("; ", adminResult.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Gagal membuat akun admin: {err}");
                }

                await userManager.AddToRoleAsync(admin, "ADMIN");
            }
        }

        var rolePermissions = new Dictionary<string, string[]>
        {
            ["ADMIN"] = ["users.read", "users.manage", "auditlogs.read"],
            ["CUSTOMER"] = ["wallet.read", "wallet.transact"]
        };

        foreach (var (roleName, permissions) in rolePermissions)
        {
            var role = await roleManager.FindByNameAsync(roleName);
            if (role is null)
            {
                role = new IdentityRole<long>(roleName);
                await roleManager.CreateAsync(role);
            }

            var existingClaims = await roleManager.GetClaimsAsync(role);
            foreach (var perm in permissions)
            {
                if (!existingClaims.Any(c => c.Type == "permission" && c.Value == perm))
                {
                    await roleManager.AddClaimAsync(role, new System.Security.Claims.Claim("permission", perm));
                }
            }
        }

        // 3. Jika data transaksi/wallet sudah pernah di-seed, hentikan di sini
        if (await db.Wallets.AnyAsync()) return;

        await using var dbTx = await db.Database.BeginTransactionAsync();
        var audits = new List<Func<AuditLog>>();

        var now = DateTime.UtcNow;
        var clock = now.AddDays(-7);

        DateTime Tick() => clock = clock.AddHours(5);
        var seq = 0;

        // 4. Seed Payment Methods
        var bank = new PaymentMethod { Code = "BANK_TRANSFER", Name = "Bank Transfer", ProviderName = "Simulated Bank", IsActive = true, CreatedAtUtc = now };
        var qris = new PaymentMethod { Code = "QRIS", Name = "QRIS", ProviderName = "Simulated QRIS", IsActive = true, CreatedAtUtc = now };
        var creditCard = new PaymentMethod { Code = "CREDIT_CARD", Name = "Credit Card", ProviderName = "Simulated Card", IsActive = true, CreatedAtUtc = now };

        db.PaymentMethods.AddRange(bank, qris, creditCard);

        // 5. Seed 10 Customer (via UserManager) + Wallet masing-masing
        var people = new[]
        {
            ("budi", "Budi Santoso"), ("siti", "Siti Rahma"), ("andi", "Andi Wijaya"),
            ("dewi", "Dewi Lestari"), ("rizky", "Rizky Ramadhan"), ("putri", "Putri Anggraini"),
            ("agus", "Agus Setiawan"), ("maya", "Maya Sari"), ("dimas", "Dimas Prakoso"), ("nadia", "Nadia Kusuma"),
        };

        var customerPassword = config["AdminSeed:CustomerPassword"] ?? "Customer123!";
        var wallets = new List<Wallet>();

        for (var i = 0; i < people.Length; i++)
        {
            var (username, fullName) = people[i];
            var createdAt = now.AddDays(-8);

            var user = new ApplicationUser
            {
                UserName = username,
                FullName = fullName,
                Email = $"{username}@example.com",
                PhoneNumber = $"0812000000{i + 1:D2}",
                EmailConfirmed = true,
                Status = UserStatus.Active,
                CreatedAtUtc = createdAt,
            };

            var createResult = await userManager.CreateAsync(user, customerPassword);
            if (!createResult.Succeeded)
            {
                var err = string.Join("; ", createResult.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Gagal seed user {username}: {err}");
            }

            await userManager.AddToRoleAsync(user, "CUSTOMER");

            var wallet = new Wallet
            {
                UserId = user.Id,
                WalletNumber = $"EW{1_000_000_001L + i}",
                Balance = 0m,
                Status = WalletStatus.Active,
                CreatedAtUtc = createdAt,
            };

            db.Wallets.Add(wallet);
            wallets.Add(wallet);
        }

        // 6. Helper Simulasi Mutasi, Top Up, Transfer, dan AuditLog (sama seperti Weekly 6)
        void Apply(Transaction trx, Wallet w, MutationDirection dir, DateTime at)
        {
            var before = w.Balance;
            w.Balance = dir == MutationDirection.In ? before + trx.Amount : before - trx.Amount;
            if (w.Balance < 0) throw new InvalidOperationException($"Seed data would overdraw {w.WalletNumber}");
            w.UpdatedAtUtc = at;

            db.WalletMutations.Add(new WalletMutation
            {
                Transaction = trx,
                Wallet = w,
                Direction = dir,
                Amount = trx.Amount,
                BalanceBefore = before,
                BalanceAfter = w.Balance,
                CreatedAtUtc = at,
            });
        }

        void TopUp(Wallet w, decimal amount, PaymentMethod pm, bool paid)
        {
            var n = ++seq;
            var created = Tick();
            var done = created.AddMinutes(2);

            var trx = new Transaction
            {
                ReferenceNo = $"TOP-SEED-{n:D4}",
                ReceiverWallet = w,
                Type = TransactionType.TopUp,
                Amount = amount,
                Status = paid ? TransactionStatus.Success : TransactionStatus.Pending,
                Description = $"Top up via {pm.Name}",
                CreatedAtUtc = created,
                CompletedAtUtc = paid ? done : null,
            };
            db.Transactions.Add(trx);

            var topUp = new TopUpRequest
            {
                Transaction = trx,
                Wallet = w,
                PaymentMethod = pm,
                Amount = amount,
                Status = paid ? TopUpStatus.Paid : TopUpStatus.Pending,
                ProviderReference = $"SIM-{n:D4}",
                CreatedAtUtc = created,
                ExpiresAtUtc = paid ? created.AddHours(24) : now.AddHours(24),
                PaidAtUtc = paid ? done : null,
            };
            db.TopUpRequests.Add(topUp);

            audits.Add(() => Audit(AuditActions.TopUpRequested, nameof(TopUpRequest), topUp.Id, w.UserId, trx, created,
                $"Top up {trx.ReferenceNo} sebesar {Rp(amount)} via {pm.Code} menunggu pembayaran."));

            if (paid)
            {
                Apply(trx, w, MutationDirection.In, done);
                audits.Add(() => Audit(AuditActions.TopUpPaid, nameof(TopUpRequest), topUp.Id, w.UserId, trx, done,
                    $"Top up {trx.ReferenceNo} sebesar {Rp(amount)} berhasil dibayar."));
            }
        }

        void Transfer(Wallet from, Wallet to, decimal amount)
        {
            var created = Tick();
            var trx = new Transaction
            {
                ReferenceNo = $"TRF-SEED-{++seq:D4}",
                SenderWallet = from,
                ReceiverWallet = to,
                Type = TransactionType.Transfer,
                Amount = amount,
                Status = TransactionStatus.Success,
                Description = "Seed transfer",
                CreatedAtUtc = created,
                CompletedAtUtc = created.AddSeconds(5),
            };
            db.Transactions.Add(trx);

            Apply(trx, from, MutationDirection.Out, created);
            Apply(trx, to, MutationDirection.In, created);
            audits.Add(() => Audit(AuditActions.TransferCreated, nameof(Transaction), trx.Id, from.UserId, trx, created,
                $"Transfer {trx.ReferenceNo} sebesar {Rp(amount)} dari {from.WalletNumber} ke {to.WalletNumber}."));
        }

        static string Rp(decimal v) => CurrencyFormatter.Rupiah(v);

        static AuditLog Audit(string action, string entityType, long entityId, long userId, Transaction trx, DateTime at, string desc) => new()
        {
            Action = action,
            EntityType = entityType,
            EntityId = entityId.ToString(),
            ActorUserId = userId,
            TransactionId = trx.Id,
            Outcome = AuditOutcome.Success,
            Description = desc,
            CorrelationId = "seed",
            CreatedAtUtc = at,
        };

        TopUp(wallets[0], 500_000m, bank, paid: true);
        TopUp(wallets[1], 300_000m, qris, paid: true);
        TopUp(wallets[2], 1_000_000m, bank, paid: true);
        TopUp(wallets[3], 250_000m, qris, paid: true);
        TopUp(wallets[4], 750_000m, bank, paid: true);
        TopUp(wallets[5], 100_000m, qris, paid: true);
        TopUp(wallets[6], 150_000m, qris, paid: false);

        Transfer(wallets[0], wallets[1], 100_000m);
        Transfer(wallets[2], wallets[3], 250_000m);
        Transfer(wallets[2], wallets[4], 50_000m);
        Transfer(wallets[4], wallets[0], 200_000m);
        Transfer(wallets[1], wallets[5], 75_000m);

        await db.SaveChangesAsync();

        db.AuditLogs.AddRange(audits.Select(a => a()));
        await db.SaveChangesAsync();
        await dbTx.CommitAsync();
    }
}