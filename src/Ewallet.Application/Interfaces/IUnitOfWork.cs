namespace Ewallet.Application.Interfaces;

public interface IUnitOfWork
{
  Task<int> SaveChangesAsync(CancellationToken ct = default);
  Task<IDbTransaction> BeginTransactionAsync(CancellationToken ct = default);
  void DiscardPendingChanges();
}
