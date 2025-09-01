using Api.DTOs;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CustomerService> _logger;

        public CustomerService(AppDbContext context, ILogger<CustomerService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<CustomerResponse> CreateCustomerAsync(CreateCustomerRequest request, Guid userId, CancellationToken cancellationToken = default)
        {
            // Verify user exists (security check)
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId, cancellationToken);
            if (!userExists)
            {
                throw new UnauthorizedAccessException("Invalid user");
            }

            var customer = new Customer
            {
                Name = request.Name,
                PhoneNumber = request.PhoneNumber,
                Email = request.Email,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Customer created with ID: {CustomerId} for User: {UserId}", customer.Id, userId);

            return MapToResponse(customer);
        }

        public async Task<CustomerResponse?> GetCustomerByIdAsync(Guid customerId, Guid userId, CancellationToken cancellationToken = default)
        {
            var customer = await _context.Customers
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == customerId && c.UserId == userId, cancellationToken);

            return customer == null ? null : MapToResponse(customer);
        }

        public async Task<IEnumerable<CustomerResponse>> GetCustomersAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var customers = await _context.Customers
                .AsNoTracking()
                .Where(c => c.UserId == userId)
                .OrderBy(c => c.Name)
                .Select(c => new CustomerResponse
                {
                    Id = c.Id,
                    Name = c.Name,
                    PhoneNumber = c.PhoneNumber,
                    Email = c.Email,
                    UserId = c.UserId,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync(cancellationToken);

            return customers;
        }

        public async Task<CustomerResponse?> UpdateCustomerAsync(Guid customerId, UpdateCustomerRequest request, Guid userId, CancellationToken cancellationToken = default)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Id == customerId && c.UserId == userId, cancellationToken);

            if (customer == null)
            {
                return null;
            }

            customer.Name = request.Name;
            customer.PhoneNumber = request.PhoneNumber;
            customer.Email = request.Email;
            customer.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Customer updated: {CustomerId} for User: {UserId}", customerId, userId);

            return MapToResponse(customer);
        }

        public async Task<bool> DeleteCustomerAsync(Guid customerId, Guid userId, CancellationToken cancellationToken = default)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Id == customerId && c.UserId == userId, cancellationToken);

            if (customer == null)
            {
                return false;
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Customer deleted: {CustomerId} for User: {UserId}", customerId, userId);

            return true;
        }

        private static CustomerResponse MapToResponse(Customer customer)
        {
            return new CustomerResponse
            {
                Id = customer.Id,
                Name = customer.Name,
                PhoneNumber = customer.PhoneNumber,
                Email = customer.Email,
                UserId = customer.UserId,
                CreatedAt = customer.CreatedAt,
                UpdatedAt = customer.UpdatedAt
            };
        }
    }
}
