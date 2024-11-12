using MediatR;

namespace Application.Use_Cases.Commands
{
    public class UpdateMedicalRecordCommand : IRequest<Unit>
    {
        public Guid RecordId { get; set; }
        public Guid PatientId { get; set; }
        public DateTime Date { get; set; }
        public string Diagnosis { get; set; }
        //public List<Prescription> Prescriptions { get; set; } = new List<Prescription>();
        public string Notes { get; set; }
    }
}
