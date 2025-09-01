using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Api.DTOs;
using Api.Services;
using System.Security.Claims;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/customers")]
    [Authorize]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        private readonly ILogger<CustomersController> _logger;

        public CustomersController(ICustomerService customerService, ILogger<CustomersController> logger)
        {
            _customerService = customerService;
            _logger = logger;
        }

        /// <summary>
        /// Create a new customer
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var userId = GetCurrentUserId();
                var response = await _customerService.CreateCustomerAsync(request, userId, cancellationToken);
                
                return Created($"/api/customers/{response.Id}", response);
            }
            catch (UnauthorizedAccessException)
            {
                _logger.LogWarning("Unauthorized customer creation attempt");
                return Unauthorized(new { message = "Invalid user" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during customer creation");
                return StatusCode(500, new { message = "An error occurred while creating the customer" });
            }
        }

        /// <summary>
        /// Get a customer by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomer(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var userId = GetCurrentUserId();
                var customer = await _customerService.GetCustomerByIdAsync(id, userId, cancellationToken);
                
                if (customer == null)
                {
                    return NotFound(new { message = "Customer not found" });
                }

                return Ok(customer);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving customer: {CustomerId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the customer" });
            }
        }

        /// <summary>
        /// Get all customers for the current user
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetCustomers(CancellationToken cancellationToken)
        {
            try
            {
                var userId = GetCurrentUserId();
                var customers = await _customerService.GetCustomersAsync(userId, cancellationToken);
                
                return Ok(customers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving customers");
                return StatusCode(500, new { message = "An error occurred while retrieving customers" });
            }
        }

        /// <summary>
        /// Update a customer
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(Guid id, [FromBody] UpdateCustomerRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var userId = GetCurrentUserId();
                var customer = await _customerService.UpdateCustomerAsync(id, request, userId, cancellationToken);
                
                if (customer == null)
                {
                    return NotFound(new { message = "Customer not found" });
                }

                return Ok(customer);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating customer: {CustomerId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the customer" });
            }
        }

        /// <summary>
        /// Delete a customer
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var userId = GetCurrentUserId();
                var success = await _customerService.DeleteCustomerAsync(id, userId, cancellationToken);
                
                if (!success)
                {
                    return NotFound(new { message = "Customer not found" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting customer: {CustomerId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the customer" });
            }
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                throw new UnauthorizedAccessException("Invalid token");
            }

            return userId;
        }
    }
}
