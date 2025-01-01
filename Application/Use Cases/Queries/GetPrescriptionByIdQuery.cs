using Application.DTOs;
using MediatR;
using System;

namespace Application.Use_Cases.Queries
{
    public class GetPrescriptionByIdQuery : IRequest<PrescriptionDTO>
    {
        public Guid PrescriptionId { get; }

        public GetPrescriptionByIdQuery(Guid prescriptionId)
        {
            PrescriptionId = prescriptionId;
        }
    }
}
