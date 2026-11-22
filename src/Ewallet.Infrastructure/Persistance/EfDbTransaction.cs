using Ewallet.Application.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;

namespace Ewallet.Infrastructure.Persistance;

internal sealed class EfDbTransaction(IDbContextTransaction inner) : IDbTransaction
{
    public Task CommitAsync(CancellationToken ct = default) => inner.CommitAsync(ct);

    public Task RollbackAsync(CancellationToken ct = default) => inner.RollbackAsync(ct);

    public ValueTask DisposeAsync() => inner.DisposeAsync();
}