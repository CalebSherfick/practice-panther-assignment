using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Api.Models
{
    public class User : BaseEntity
    {
        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [StringLength(255)]
        [JsonIgnore]        
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        [StringLength(255)]
        public string FirmName { get; set; } = string.Empty;
        
        public ICollection<Customer> Customers { get; set; } = new List<Customer>();
    }
}
