using System;
using Ewallet.Application.Dtos.PaymentMethods;
using Ewallet.Domain.Entities;

namespace Ewallet.Application.Interfaces;

public interface IPaymentMethodRepository
{
    Task<List<PaymentMethodResponse>> GetActiveAsync(CancellationToken ct = default);
    Task<PaymentMethod?> GetActiveByIdAsync(int id, CancellationToken ct = default);
}