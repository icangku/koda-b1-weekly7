using System;

namespace Ewallet.Application.Exceptions;

public class ConcurrencyConflictException : Exception
{
  public ConcurrencyConflictException() : base("Conflict Concurrency") { }
}
