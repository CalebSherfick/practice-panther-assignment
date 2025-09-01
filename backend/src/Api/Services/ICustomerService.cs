using Api.DTOs;

namespace Api.Services
{
    public interface ICustomerService
    {
        Task<CustomerResponse> CreateCustomerAsync(CreateCustomerRequest request, Guid userId, CancellationToken cancellationToken = default);
        Task<CustomerResponse?> GetCustomerByIdAsync(Guid customerId, Guid userId, CancellationToken cancellationToken = default);
        Task<IEnumerable<CustomerResponse>> GetCustomersAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<CustomerResponse?> UpdateCustomerAsync(Guid customerId, UpdateCustomerRequest request, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> DeleteCustomerAsync(Guid customerId, Guid userId, CancellationToken cancellationToken = default);
    }
}
