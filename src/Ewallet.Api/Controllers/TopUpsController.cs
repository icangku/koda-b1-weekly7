using Ewallet.Application.Dtos.TopUps;
using Ewallet.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ewallet.Controllers;

[ApiController]
[Route("api/topups")]
public class TopUpsController(ITopUpService service, IWebHostEnvironment env) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTopUpRequest request, CancellationToken ct)
    {
        var created = await service.RequestAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetById(long id, CancellationToken ct) => Ok(await service.GetByIdAsync(id, ct));

    [HttpPost("{id:long}/confirm")]
    public async Task<IActionResult> Confirm(long id, CancellationToken ct)
    {
        if (!(env.IsDevelopment() || env.IsEnvironment("Testing"))) return NotFound();
        return Ok(await service.ConfirmAsync(id, ct));
    }
}
