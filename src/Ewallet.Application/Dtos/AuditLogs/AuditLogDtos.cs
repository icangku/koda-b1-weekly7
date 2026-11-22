using Ewallet.Application.Dtos.Common;
using Ewallet.Domain.Entities;

namespace Ewallet.Application.Dtos.AuditLogs;

public class AuditLogQuery : PageQuery
{
  public string? Action { get; set; }
  public AuditOutcome? Outcome { get; set; }
  public long? ActorUserId { get; set; }
  public long? TransactionId { get; set; }
  public DateTime? From { get; set; }
  public DateTime? To { get; set; }
}

public record AuditLogResponse(
    long Id,
    long? ActorUserId,
    string? ActorUsername,
    long? TransactionId,
    string Action,
    string EntityType,
    string? EntityId,
    AuditOutcome Outcome,
    string? Description,
    string? CorrelationId,
    DateTime CreatedAtUtc);
