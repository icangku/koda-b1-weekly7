using System;

namespace Ewallet.Application.Interfaces;

public interface IUnitOfWork
{
  Task<int> SaveChangesAsync(CancellationToken ct = default);
  Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken ct = default);
  void ClearChangeTracker();
}
