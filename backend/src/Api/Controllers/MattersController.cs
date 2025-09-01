using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Api.DTOs;
using Api.Services;
using System.Security.Claims;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/customers/{customerId}/matters")]
    [Authorize]
    public class MattersController : ControllerBase
    {
        private readonly IMatterService _matterService;
        private readonly ILogger<MattersController> _logger;

        public MattersController(IMatterService matterService, ILogger<MattersController> logger)
        {
            _matterService = matterService;
            _logger = logger;
        }

        /// <summary>
        /// Create a new matter for a customer
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateMatter(Guid customerId, [FromBody] CreateMatterRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var userId = GetCurrentUserId();
                var response = await _matterService.CreateMatterAsync(customerId, request, userId, cancellationToken);
                
                return Created($"/api/customers/{customerId}/matters/{response.Id}", response);
            }
            catch (UnauthorizedAccessException)
            {
                _logger.LogWarning("Unauthorized matter creation attempt for Customer: {CustomerId}", customerId);
                return Forbid("Customer not found or access denied");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during matter creation for Customer: {CustomerId}", customerId);
                return StatusCode(500, new { message = "An error occurred while creating the matter" });
            }
        }

        /// <summary>
        /// Get a specific matter for a customer
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMatter(Guid customerId, Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var userId = GetCurrentUserId();
                var matter = await _matterService.GetMatterByIdAsync(id, customerId, userId, cancellationToken);
                
                if (matter == null)
                {
                    return NotFound(new { message = "Matter not found" });
                }

                return Ok(matter);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving matter: {MatterId} for Customer: {CustomerId}", id, customerId);
                return StatusCode(500, new { message = "An error occurred while retrieving the matter" });
            }
        }

        /// <summary>
        /// Get all matters for a customer
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetMatters(Guid customerId, CancellationToken cancellationToken)
        {
            try
            {
                var userId = GetCurrentUserId();
                var matters = await _matterService.GetMattersAsync(customerId, userId, cancellationToken);
                
                return Ok(matters);
            }
            catch (UnauthorizedAccessException)
            {
                _logger.LogWarning("Unauthorized matters access attempt for Customer: {CustomerId}", customerId);
                return Forbid("Customer not found or access denied");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving matters for Customer: {CustomerId}", customerId);
                return StatusCode(500, new { message = "An error occurred while retrieving matters" });
            }
        }

        /// <summary>
        /// Update a matter
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(MatterResponse), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> UpdateMatter(Guid customerId, Guid id, [FromBody] UpdateMatterRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var userId = GetCurrentUserId();
                var matter = await _matterService.UpdateMatterAsync(id, customerId, request, userId, cancellationToken);
                
                if (matter == null)
                {
                    return NotFound(new { message = "Matter not found" });
                }

                return Ok(matter);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating matter: {MatterId} for Customer: {CustomerId}", id, customerId);
                return StatusCode(500, new { message = "An error occurred while updating the matter" });
            }
        }

        /// <summary>
        /// Delete a matter
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMatter(Guid customerId, Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var userId = GetCurrentUserId();
                var success = await _matterService.DeleteMatterAsync(id, customerId, userId, cancellationToken);
                
                if (!success)
                {
                    return NotFound(new { message = "Matter not found" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting matter: {MatterId} for Customer: {CustomerId}", id, customerId);
                return StatusCode(500, new { message = "An error occurred while deleting the matter" });
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
