namespace Ewallet.Application.Dtos.PaymentMethods;

public record PaymentMethodResponse(int Id, string Code, string Name, string? ProviderName);