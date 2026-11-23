using Ewallet.Application.Dtos.PaymentMethods;
using Ewallet.Application.Interfaces;
using Ewallet.Data;
using Ewallet.Domain.Entities;
using Ewallet.Infrastructure.Persistance;
using Microsoft.EntityFrameworkCore;

namespace Ewallet.Infrastructure.Repositories;

public class PaymentMethodRepository(AppDbContext db) : IPaymentMethodRepository
{
    public Task<List<PaymentMethodResponse>> GetActiveAsync(CancellationToken ct = default)
        => db.PaymentMethods.AsNoTracking()
            .Where(p => p.IsActive)
            .OrderBy(p => p.Id)
            .Select(p => new PaymentMethodResponse(p.Id, p.Code, p.Name, p.ProviderName))
            .ToListAsync(ct);

    public Task<PaymentMethod?> GetActiveByIdAsync(int id, CancellationToken ct = default)
        => db.PaymentMethods.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id && p.IsActive, ct);
}
