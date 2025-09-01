using System.ComponentModel.DataAnnotations;

namespace Api.DTOs
{
    public class CreateCustomerRequest
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [Phone]
        [StringLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;
        
        [EmailAddress]
        [StringLength(255)]
        public string? Email { get; set; }
    }
    
    public class UpdateCustomerRequest
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [Phone]
        [StringLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;
        
        [EmailAddress]
        [StringLength(255)]
        public string? Email { get; set; }
    }
    
    public class CustomerResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Email { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
