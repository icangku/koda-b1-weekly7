using Ewallet.Dtos.AuditLogs;
using Ewallet.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ewallet.Controllers;

[ApiController]
[Route("api/audit-logs")]
public class AuditLogsController(IAuditLogService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] AuditLogQuery query, CancellationToken ct) => Ok(await service.GetAsync(query, ct));
}
