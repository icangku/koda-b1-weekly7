using Ewallet.Application.Exceptions;
using Ewallet.Application.Interfaces;
using Ewallet.Data;
using Ewallet.Infrastructure.Persistance;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Infrastructure.Repositories;

public class UnitOfWork(AppDbContext db) : IUnitOfWork
{
    public async Task<IDbTransaction> BeginTransactionAsync(CancellationToken ct = default)
        => new EfDbTransaction(await db.Database.BeginTransactionAsync(ct));

    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        try { return await db.SaveChangesAsync(ct); }
        catch (DbUpdateConcurrencyException ex) { throw new ConcurrencyConflictException(); }
        catch (DbUpdateException ex)            { throw new DataConstraintException(); }
    }

    public void DiscardPendingChanges() => db.ChangeTracker.Clear();
}
