using MediatR;
using System;

namespace Application.Use_Cases.Commands
{
    public class AddPrescriptionCommand : IRequest<Guid>
    {
        public string MedicationName { get; set; }
        public string Dosage { get; set; }
        public string Frequency { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Notes { get; set; }

        public AddPrescriptionCommand(string medicationName, string dosage, string frequency, DateTime startDate, DateTime endDate, string notes)
        {
            MedicationName = medicationName;
            Dosage = dosage;
            Frequency = frequency;
            StartDate = startDate;
            EndDate = endDate;
            Notes = notes;
        }
    }
}