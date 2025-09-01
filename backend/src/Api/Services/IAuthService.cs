using Api.DTOs;

namespace Api.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> SignUpAsync(CreateUserRequest request, CancellationToken cancellationToken = default);
        Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
        Task<UserResponse?> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken = default);
        string GenerateJwtToken(Guid userId, string email);
    }
}
