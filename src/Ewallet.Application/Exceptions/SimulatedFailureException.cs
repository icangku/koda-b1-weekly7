using System;

namespace Ewallet.Application.Exceptions;

public class SimulatedFailureException : Exception
{
      public SimulatedFailureException()
        : base("Simulasi kegagalan setelah saldo diubah. Seluruh perubahan dibatalkan (rollback).") { }
}
