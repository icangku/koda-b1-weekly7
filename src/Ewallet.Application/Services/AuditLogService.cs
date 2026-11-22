using Ewallet.Application.Dtos.AuditLogs;
using Ewallet.Application.Dtos.Common;
using Ewallet.Application.Interfaces;
using Ewallet.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace Ewallet.Application.Services;

public record AuditEntry(
    string Action,
    AuditOutcome Outcome,
    string EntityType,
    string? EntityId,
    long? ActorUserId,
    long? TransactionId,
    string? Description);

public interface IAuditLogService
{
  void Record(AuditEntry entry);
  Task RecordIndependentAsync(AuditEntry entry);
  Task<PagedResponse<AuditLogResponse>> GetAsync(AuditLogQuery query, CancellationToken ct = default);
}

public class AuditLogService(IAuditLogRepository logs, IUnitOfWork uow, IHttpContextAccessor http) : IAuditLogService
{
  public void Record(AuditEntry e) => logs.Add(new AuditLog
  {
    Action = e.Action,
    Outcome = e.Outcome,
    EntityType = e.EntityType,
    EntityId = e.EntityId,
    ActorUserId = e.ActorUserId,
    TransactionId = e.TransactionId,
    Description = e.Description is { Length: > 500 } d ? d[..500] : e.Description,
    CorrelationId = http.HttpContext?.TraceIdentifier,
    CreatedAtUtc = DateTime.UtcNow,
  });

  public async Task RecordIndependentAsync(AuditEntry entry)
  {
    uow.ClearChangeTracker();
    Record(entry);
    await uow.SaveChangesAsync(CancellationToken.None);
  }

  public Task<PagedResponse<AuditLogResponse>> GetAsync(AuditLogQuery query, CancellationToken ct = default)
    => logs.GetPagedAsync(query, ct);
}
