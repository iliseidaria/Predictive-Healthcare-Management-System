using Application.DTOs;
using MediatR;
using System.Collections.Generic;

namespace Application.Use_Cases.Queries
{
    public class GetPrescriptionsByMedicationQuery : IRequest<List<PrescriptionDTO>>
    {
        public string MedicationName { get; set; }

        public GetPrescriptionsByMedicationQuery(string medicationName)
        {
            MedicationName = medicationName;
        }
    }
}
