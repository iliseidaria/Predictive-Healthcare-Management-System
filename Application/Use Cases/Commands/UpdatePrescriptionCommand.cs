using MediatR;
using System;

namespace Application.Use_Cases.Commands
{
    public class UpdatePrescriptionCommand : IRequest<bool>
    {
        public Guid PrescriptionId { get; set; }
        public string MedicationName { get; set; }
        public string Dosage { get; set; }
        public string Frequency { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Notes { get; set; }

        public UpdatePrescriptionCommand(Guid prescriptionId, string medicationName, string dosage, string frequency, DateTime startDate, DateTime endDate, string notes)
        {
            PrescriptionId = prescriptionId;
            MedicationName = medicationName;
            Dosage = dosage;
            Frequency = frequency;
            StartDate = startDate;
            EndDate = endDate;
            Notes = notes;
        }
    }
}
