using Application.DTOs;
using MediatR;
using System;

namespace Application.Use_Cases.Queries
{
    public class GetPrescriptionByIdQuery : IRequest<PrescriptionDto>
    {
        public Guid PrescriptionId { get; }

        public GetPrescriptionByIdQuery(Guid prescriptionId)
        {
            PrescriptionId = prescriptionId;
        }
    }
}
