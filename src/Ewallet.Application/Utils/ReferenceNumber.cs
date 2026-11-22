namespace Ewallet.Application.Utils;

public static class ReferenceNumber
{
    public static string New(string prefix, DateTime nowUtc)
    => $"{prefix}-{nowUtc:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N")[..8].ToUpperInvariant()}";
}
