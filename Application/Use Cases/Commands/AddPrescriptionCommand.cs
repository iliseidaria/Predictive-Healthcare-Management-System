using MediatR;

namespace Application.Use_Cases.Commands
{
  public class AddPrescriptionCommand : IRequest<Guid>
  {
    public Guid PatientId { get; set; }
    public string MedicationName { get; set; }
    public string Dosage { get; set; }
    public string Frequency { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Notes { get; set; }
  }
}

