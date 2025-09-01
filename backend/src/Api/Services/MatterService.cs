using Api.DTOs;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services
{
    public class MatterService : IMatterService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<MatterService> _logger;

        public MatterService(AppDbContext context, ILogger<MatterService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<MatterResponse> CreateMatterAsync(Guid customerId, CreateMatterRequest request, Guid userId, CancellationToken cancellationToken = default)
        {
            // Verify that the customer exists and belongs to the user
            var customerExists = await _context.Customers
                .AsNoTracking()
                .AnyAsync(c => c.Id == customerId && c.UserId == userId, cancellationToken);

            if (!customerExists)
            {
                throw new UnauthorizedAccessException("Customer not found or access denied");
            }

            var matter = new Matter
            {
                Name = request.Name,
                Description = request.Description,
                Status = request.Status,
                AssignedEmployee = request.AssignedEmployee,
                CustomerId = customerId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Matters.Add(matter);
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Matter created with ID: {MatterId} for Customer: {CustomerId} by User: {UserId}", 
                matter.Id, customerId, userId);

            return MapToResponse(matter);
        }

        public async Task<MatterResponse?> GetMatterByIdAsync(Guid matterId, Guid customerId, Guid userId, CancellationToken cancellationToken = default)
        {
            var matter = await _context.Matters
                .AsNoTracking()
                .Where(m => m.Id == matterId && m.CustomerId == customerId)
                .Join(_context.Customers.AsNoTracking(),
                    matter => matter.CustomerId,
                    customer => customer.Id,
                    (matter, customer) => new { matter, customer })
                .Where(x => x.customer.UserId == userId)
                .Select(x => x.matter)
                .FirstOrDefaultAsync(cancellationToken);

            return matter == null ? null : MapToResponse(matter);
        }

        public async Task<IEnumerable<MatterResponse>> GetMattersAsync(Guid customerId, Guid userId, CancellationToken cancellationToken = default)
        {
            // Verify that the customer belongs to the user
            var customerExists = await _context.Customers
                .AsNoTracking()
                .AnyAsync(c => c.Id == customerId && c.UserId == userId, cancellationToken);

            if (!customerExists)
            {
                throw new UnauthorizedAccessException("Customer not found or access denied");
            }

            var matters = await _context.Matters
                .AsNoTracking()
                .Where(m => m.CustomerId == customerId)
                .OrderBy(m => m.Name)
                .Select(m => new MatterResponse
                {
                    Id = m.Id,
                    Name = m.Name,
                    Description = m.Description,
                    Status = m.Status,
                    StatusDisplayName = m.Status.ToString(),
                    AssignedEmployee = m.AssignedEmployee,
                    CustomerId = m.CustomerId,
                    CreatedAt = m.CreatedAt,
                    UpdatedAt = m.UpdatedAt
                })
                .ToListAsync(cancellationToken);

            return matters;
        }

        public async Task<MatterResponse?> UpdateMatterAsync(Guid matterId, Guid customerId, UpdateMatterRequest request, Guid userId, CancellationToken cancellationToken = default)
        {
            var matter = await _context.Matters
                .Where(m => m.Id == matterId && m.CustomerId == customerId)
                .Join(_context.Customers,
                    matter => matter.CustomerId,
                    customer => customer.Id,
                    (matter, customer) => new { matter, customer })
                .Where(x => x.customer.UserId == userId)
                .Select(x => x.matter)
                .FirstOrDefaultAsync(cancellationToken);

            if (matter == null)
            {
                return null;
            }

            matter.Name = request.Name;
            matter.Description = request.Description;
            matter.Status = request.Status;
            matter.AssignedEmployee = request.AssignedEmployee;
            matter.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Matter updated: {MatterId} for Customer: {CustomerId} by User: {UserId}", 
                matterId, customerId, userId);

            return MapToResponse(matter);
        }

        public async Task<bool> DeleteMatterAsync(Guid matterId, Guid customerId, Guid userId, CancellationToken cancellationToken = default)
        {
            var matter = await _context.Matters
                .Where(m => m.Id == matterId && m.CustomerId == customerId)
                .Join(_context.Customers,
                    matter => matter.CustomerId,
                    customer => customer.Id,
                    (matter, customer) => new { matter, customer })
                .Where(x => x.customer.UserId == userId)
                .Select(x => x.matter)
                .FirstOrDefaultAsync(cancellationToken);

            if (matter == null)
            {
                return false;
            }

            _context.Matters.Remove(matter);
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Matter deleted: {MatterId} for Customer: {CustomerId} by User: {UserId}", 
                matterId, customerId, userId);

            return true;
        }

        private static MatterResponse MapToResponse(Matter matter)
        {
            return new MatterResponse
            {
                Id = matter.Id,
                Name = matter.Name,
                Description = matter.Description,
                Status = matter.Status,
                StatusDisplayName = matter.Status.ToString(),
                AssignedEmployee = matter.AssignedEmployee,
                CustomerId = matter.CustomerId,
                CreatedAt = matter.CreatedAt,
                UpdatedAt = matter.UpdatedAt
            };
        }
    }
}
