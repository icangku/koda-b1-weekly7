using System;
using Ewallet.Application.Dtos.Wallets;
using Ewallet.Domain.Entities;

namespace Ewallet.Application.Interfaces;

public interface IWalletRepository
{
  Task<Wallet?> GetByIdAsync(long id, CancellationToken ct = default);
  Task<Wallet?> GetByWalletNumberAsync(string walletNumber, CancellationToken ct = default);
  Task<bool> ExistsAsync(long id, CancellationToken ct = default);
  Task<bool> WalletNumberExistsAsync(string walletNumber, CancellationToken ct = default);
  Task<WalletResponse?> GetInfoAsync(long id, CancellationToken ct = default);
  void SetExpectedRowVersion(Wallet wallet, byte[] rowVersion);
}