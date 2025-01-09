using MediatR;
using System;

namespace Application.Use_Cases.Commands
{
  public class UpdatePrescriptionCommand : IRequest<Unit>
  {
    public Guid PrescriptionId { get; set; }
    public Guid PatientId { get; set; }
    public string MedicationName { get; set; }
    public string Dosage { get; set; }
    public string Frequency { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Notes { get; set; }
  }
}
