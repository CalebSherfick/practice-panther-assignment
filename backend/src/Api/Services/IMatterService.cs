using Api.DTOs;

namespace Api.Services
{
    public interface IMatterService
    {
        Task<MatterResponse> CreateMatterAsync(Guid customerId, CreateMatterRequest request, Guid userId, CancellationToken cancellationToken = default);
        Task<MatterResponse?> GetMatterByIdAsync(Guid matterId, Guid customerId, Guid userId, CancellationToken cancellationToken = default);
        Task<IEnumerable<MatterResponse>> GetMattersAsync(Guid customerId, Guid userId, CancellationToken cancellationToken = default);
        Task<MatterResponse?> UpdateMatterAsync(Guid matterId, Guid customerId, UpdateMatterRequest request, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> DeleteMatterAsync(Guid matterId, Guid customerId, Guid userId, CancellationToken cancellationToken = default);
    }
}
