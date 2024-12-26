using Domain.Entities;

namespace Application.DTOs
{
    public class MedicalRecordDto
    {
        public Guid RecordId { get; set; }
        public Guid PatientId { get; set; }
        public DateTime Date { get; set; }
        public required string Diagnosis { get; set; }
        //public List<Prescription> Prescriptions { get; set; } = new List<Prescription>();
        public string Notes { get; set; } = string.Empty;
  }
}
