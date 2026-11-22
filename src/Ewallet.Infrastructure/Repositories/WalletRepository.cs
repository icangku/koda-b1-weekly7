using Ewallet.Application.Dtos.Wallets;
using Ewallet.Application.Interfaces;
using Ewallet.Data;
using Ewallet.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Infrastructure.Repositories;

// public class WalletRepository(AppDbContext db) : IWalletRepository
// {
//   public Task<Wallet?> GetByIdAsync(long id, CancellationToken ct = default)
//     => db.Wallets.Include(w => w.User).FirstOrDefaultAsync(w => w.Id == id, ct);

//   public Task<Wallet?> GetByWalletNumberAsync(string walletNumber, CancellationToken ct = default)
//     => db.Wallets.Include(w => w.User).FirstOrDefaultAsync(w => w.WalletNumber == walletNumber, ct);

//   public Task<bool> ExistsAsync(long id, CancellationToken ct = default)
//     => db.Wallets.AnyAsync(w => w.Id == id, ct);

//   public Task<bool> WalletNumberExistsAsync(string walletNumber, CancellationToken ct = default)
//     => db.Wallets.AnyAsync(w => w.WalletNumber == walletNumber, ct);

//   public async Task<WalletResponse?> GetInfoAsync(long id, CancellationToken ct = default)
//   {
//     var w = await db.Wallets.AsNoTracking()
//       .Where(w => w.Id == id)
//       .Select(w => new
//       {
//         w.Id, w.WalletNumber, w.UserId, w.User.Username, w.User.FullName,
//         w.Balance, w.Status, w.RowVersion, w.CreatedAtUtc, w.UpdatedAtUtc
//       })
//       .FirstOrDefaultAsync(ct);

//     return w is null ? null : new WalletResponse(
//       w.Id, w.WalletNumber, w.UserId, w.Username, w.FullName, w.Balance, w.Status,
//       Convert.ToBase64String(w.RowVersion ?? []), w.CreatedAtUtc, w.UpdatedAtUtc);
//   }

//   public void SetExpectedRowVersion(Wallet wallet, byte[] rowVersion)
//     => db.Entry(wallet).Property(w => w.RowVersion).OriginalValue = rowVersion;
// }
