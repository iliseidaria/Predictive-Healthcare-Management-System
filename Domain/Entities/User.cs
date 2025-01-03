using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
  public class User
  {
    [Key]  // `Id` ca PK
    //[DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Auto-increment
    public Guid Id { get; set; }

    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public string Role { get; set; } = "Doctor";
  }
}
