using Ewallet.Application.Dtos.Users;
using Ewallet.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ewallet.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController(IUserService service) : ControllerBase
{
  [HttpGet]
  [Authorize(Policy = "users.read")]
  public async Task<IActionResult> GetAll([FromQuery] UserQuery query, CancellationToken ct)
      => Ok(await service.GetAllAsync(query, ct));

  [HttpGet("{id:long}")]
  [Authorize(Policy = "users.read")]
  public async Task<IActionResult> GetById(long id, CancellationToken ct) => Ok(await service.GetByIdAsync(id, ct));

  [HttpPut("{id:long}")]
  [Authorize(Policy = "users.manage")]
  public async Task<IActionResult> Update(long id, [FromBody] UpdateUserRequest request, CancellationToken ct)
  {
    await service.UpdateAsync(id, request, ct);
    return NoContent();
  }
}