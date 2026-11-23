using Ewallet.Application.Dtos.History;
using Ewallet.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ewallet.Controllers;

[ApiController]
[Route("api/wallets")]
public class WalletsController(IWalletService service) : ControllerBase
{
	[HttpGet("{id:long}")]
	public async Task<IActionResult> GetInfo(long id, CancellationToken ct) => Ok(await service.GetInfoAsync(id, ct));

	[HttpGet("{id:long}/transactions")]
	public async Task<IActionResult> GetTransactions(long id, [FromQuery] HistoryQuery query, CancellationToken ct)
			=> Ok(await service.GetTransactionsAsync(id, query, ct));

	[HttpGet("{id:long}/mutations")]
	public async Task<IActionResult> GetMutations(long id, [FromQuery] HistoryQuery query, CancellationToken ct)
			=> Ok(await service.GetMutationsAsync(id, query, ct));
}
