using Ewallet.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ewallet.Api.Controllers;

[ApiController]
[Route("api/payment-methods")]
[Authorize]
public class PaymentMethodsController(IPaymentMethodService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetActive(CancellationToken ct) => Ok(await service.GetActiveAsync(ct));
}