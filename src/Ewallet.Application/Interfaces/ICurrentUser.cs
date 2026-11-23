using System;

namespace Ewallet.Application.Interfaces;

public interface ICurrentUser
{
  long? UserId { get; }
  string? CorrelationId { get; }
}
