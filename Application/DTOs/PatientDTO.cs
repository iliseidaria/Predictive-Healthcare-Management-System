using Domain.Entities;

namespace Application.DTOs
{
    public class PatientDTO
    {
        public Guid PatientId { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public required string ContactInformation { get; set; }
        public required string Address { get; set; }
        public string? PhotoPath { get; set; }
    }
}
