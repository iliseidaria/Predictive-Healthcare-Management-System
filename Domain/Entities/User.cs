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
    [Required]
    public string Role { get; set; } = string.Empty;
    [Required]
    public string UserType { get; set; } = "Doctor";
    /**/
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? ContactInformation { get; set; }
    public string? Address { get; set; }
    public string? PhotoPath { get; set; }

    public MedicalRecord? MedicalHistory { get; set; }
    public List<Appointment>? Appointments { get; set; } = new List<Appointment>();
    public List<Prescription>? Prescriptions { get; set; } = new List<Prescription>();
  }
}
