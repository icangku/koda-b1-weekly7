using Ewallet.Application.Dtos.PaymentMethods;
using Ewallet.Application.Interfaces;

namespace Ewallet.Application.Services;

public interface IPaymentMethodService
{
    Task<List<PaymentMethodResponse>> GetActiveAsync(CancellationToken ct = default);
}
public class PaymentMethodService(IPaymentMethodRepository repo) : IPaymentMethodService
{
    public Task<List<PaymentMethodResponse>> GetActiveAsync(CancellationToken ct = default)
        => repo.GetActiveAsync(ct);
}