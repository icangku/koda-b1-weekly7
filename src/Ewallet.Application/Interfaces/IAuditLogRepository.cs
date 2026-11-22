using System;
using Ewallet.Application.Dtos.AuditLogs;
using Ewallet.Application.Dtos.Common;
using Ewallet.Domain.Entities;

namespace Ewallet.Application.Interfaces;

public interface IAuditLogRepository
{
  void Add(AuditLog log);
  Task<PagedResponse<AuditLogResponse>> GetPagedAsync(AuditLogQuery query, CancellationToken ct = default);
}