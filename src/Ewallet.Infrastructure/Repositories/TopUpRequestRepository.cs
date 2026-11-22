using Ewallet.Application.Interfaces;
using Ewallet.Data;
using Ewallet.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Infrastructure.Repositories;

// public class TopUpRequestRepository(AppDbContext db) : ITopUpRequestRepository
// {
//   public void Add(TopUpRequest request) => db.TopUpRequests.Add(request);

//   public Task<TopUpRequest?> GetForUpdateAsync(long id, CancellationToken ct = default)
//     => db.TopUpRequests
//       .Include(r => r.Transaction)
//       .Include(r => r.Wallet).ThenInclude(w => w.User)
//       .Include(r => r.PaymentMethod)
//       .FirstOrDefaultAsync(r => r == id, ct);

//   public Task<TopUpRequest?> GetDetailAsync(long id, CancellationToken ct = default)
//     => db.TopUpRequests.AsNoTracking()
//       .Include(r => r.Transaction)
//       .Include(r => r.Wallet)
//       .Include(r => r.PaymentMethod)
//       .FirstOrDefaultAsync(r => r.Id == id, ct);
// }
