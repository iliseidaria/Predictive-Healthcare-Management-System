using Domain.Entities;

namespace Application.DTOs
{
    public class MedicalRecordDTO
    {
        public Guid RecordId { get; set; }
        public Guid PatientId { get; set; }
        public DateTime Date { get; set; }
        public string Diagnosis { get; set; }
        //public List<Prescription> Prescriptions { get; set; } = new List<Prescription>();
        public string Notes { get; set; }
    }
}
