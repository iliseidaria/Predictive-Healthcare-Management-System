using MediatR;
using System;

namespace Application.Use_Cases.Commands
{
    public class DeletePrescriptionCommand : IRequest<Guid>
    {
        public Guid PrescriptionId { get; set; }

        public DeletePrescriptionCommand(Guid prescriptionId)
        {
            PrescriptionId = prescriptionId;
        }
    }
}
