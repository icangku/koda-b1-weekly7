using Ewallet.Application.Dtos.AuditLogs;
using Ewallet.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ewallet.Controllers;

[ApiController]
[Route("api/audit-logs")]
public class AuditLogsController(IAuditLogService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] AuditLogQuery query, CancellationToken ct) => Ok(await service.GetAsync(query, ct));
}
