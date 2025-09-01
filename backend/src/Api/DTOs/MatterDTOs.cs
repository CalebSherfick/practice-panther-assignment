using System.ComponentModel.DataAnnotations;
using Api.Models;

namespace Api.DTOs
{
    public class CreateMatterRequest
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        public MatterStatus Status { get; set; } = MatterStatus.Intake;

        [StringLength(255)]
        public string? AssignedEmployee { get; set; }
    }

    public class UpdateMatterRequest
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        public MatterStatus Status { get; set; }

        [StringLength(255)]
        public string? AssignedEmployee { get; set; }
    }

    public class MatterResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public MatterStatus Status { get; set; }
        public string StatusDisplayName { get; set; } = string.Empty;
        public string? AssignedEmployee { get; set; }
        public Guid CustomerId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
