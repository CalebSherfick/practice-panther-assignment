using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Models
{
    public class Matter : BaseEntity
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public MatterStatus Status { get; set; } = MatterStatus.Intake;
        
        [StringLength(255)]
        public string? AssignedEmployee { get; set; }
        
        [Required]
        public Guid CustomerId { get; set; }
        
        [ForeignKey("CustomerId")]
        public Customer Customer { get; set; } = null!;
    }
}
