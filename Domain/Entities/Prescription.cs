// Domain/Interfaces/Prescription.cs
namespace Domain.Entities
{
  public class Prescription
    {
        public Guid PrescriptionId { get; set; }
        public Guid PatientId { get; set; }
        public string MedicationName { get; set; }
        public string Dosage { get; set; }
        public string Frequency { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Notes { get; set; }

    // Navigation property
    public Patient Patient { get; set; }
  }
}
