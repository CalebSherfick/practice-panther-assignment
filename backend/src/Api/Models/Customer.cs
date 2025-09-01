using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Models
{
    public class Customer : BaseEntity
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
        
        [Required]
        public Guid UserId { get; set; }
        
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
        
        public ICollection<Matter> Matters { get; set; } = new List<Matter>();
    }
}
