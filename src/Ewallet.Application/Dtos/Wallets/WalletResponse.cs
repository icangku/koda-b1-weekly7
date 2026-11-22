using Ewallet.Domain.Entities;

namespace Ewallet.Application.Dtos.Wallets;

public record WalletResponse(
    long Id,
    string WalletNumber,
    long UserId,
    string OwnerUsername,
    string OwnerName,
    decimal Balance,
    WalletStatus Status,
    
    string RowVersion,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc);
