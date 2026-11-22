using System;
using Ewallet.Application.Dtos.Common;
using Ewallet.Application.Dtos.History;
using Ewallet.Domain.Entities;

namespace Ewallet.Application.Interfaces;

public interface IWalletMutationRepository
{
  void Add(WalletMutation mutation);
  Task<PagedResponse<MutationResponse>> GetHistoryAsync(long walletId, HistoryQuery query, CancellationToken ct = default);
}