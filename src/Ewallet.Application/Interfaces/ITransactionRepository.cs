using System;
using Ewallet.Application.Dtos.Common;
using Ewallet.Application.Dtos.History;
using Ewallet.Domain.Entities;

namespace Ewallet.Application.Interfaces;

public interface ITransactionRepository
{
  void Add(Transaction transaction);
  Task<PagedResponse<TransactionResponse>> GetHistoryAsync(long walletId, HistoryQuery query, CancellationToken ct = default);
}