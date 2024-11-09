using Domain.Entities;

namespace Application.DTOs
{
    public class PatientDTO
    {
        public Guid PatientId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string ContactInformation { get; set; }
        public string Address { get; set; }
        public string PhotoPath { get; set; }
    }
}