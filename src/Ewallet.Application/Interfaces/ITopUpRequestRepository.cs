using System;
using Ewallet.Domain.Entities;

namespace Ewallet.Application.Interfaces;

public interface ITopUpRequestRepository
{
  void Add(TopUpRequest request);
  Task<TopUpRequest?> GetForUpdateAsync(long id, CancellationToken ct = default);
  Task<TopUpRequest?> GetDetailAsync(long id, CancellationToken ct = default);
}