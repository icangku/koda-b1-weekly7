using Ewallet.Application.Dtos.Wallets;
using Ewallet.Application.Interfaces;
using Ewallet.Data;
using Ewallet.Domain.Entities;
using Ewallet.Infrastructure.Persistance;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Infrastructure.Repositories;

public class WalletRepository(AppDbContext db) : IWalletRepository
{
  public Task<Wallet?> GetByIdAsync(long id, CancellationToken ct = default)
    => db.Wallets.FirstOrDefaultAsync(w => w.Id == id, ct);

  public Task<Wallet?> GetByWalletNumberAsync(string walletNumber, CancellationToken ct = default)
    => db.Wallets.FirstOrDefaultAsync(w => w.WalletNumber == walletNumber, ct);

  public Task<bool> ExistsAsync(long id, CancellationToken ct = default)
    => db.Wallets.AnyAsync(w => w.Id == id, ct);

  public Task<bool> WalletNumberExistsAsync(string walletNumber, CancellationToken ct = default)
    => db.Wallets.AnyAsync(w => w.WalletNumber == walletNumber, ct);

  public async Task<WalletResponse?> GetInfoAsync(long id, CancellationToken ct = default)
  {
    var w = await (
        from wallet in db.Wallets.AsNoTracking()
        join user in db.Users.AsNoTracking() on wallet.UserId equals user.Id
        where wallet.Id == id
        select new
        {
            wallet.Id,
            wallet.WalletNumber,
            wallet.UserId,
            UserName = user.UserName ?? string.Empty,
            user.FullName,
            wallet.Balance,
            wallet.Status,
            wallet.RowVersion,
            wallet.CreatedAtUtc,
            wallet.UpdatedAtUtc
        })
        .FirstOrDefaultAsync(ct);

    return w is null ? null : new WalletResponse(
        w.Id,
        w.WalletNumber,
        w.UserId,
        w.UserName,
        w.FullName,
        w.Balance,
        w.Status,
        Convert.ToBase64String(w.RowVersion ?? []),
        w.CreatedAtUtc,
        w.UpdatedAtUtc);
  }
  public Task<Wallet?> GetByUserIdAsync(long userId, CancellationToken ct = default)
    => db.Wallets.FirstOrDefaultAsync(w => w.UserId == userId, ct);
  public void SetExpectedRowVersion(Wallet wallet, byte[] rowVersion)
    => db.Entry(wallet).Property(w => w.RowVersion).OriginalValue = rowVersion;

  public void Add(Wallet wallet) => db.Wallets.Add(wallet);
}
