using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class UpdatePatientCommand : CreatePatientCommand, IRequest<Unit>
    {
        public Guid PatientId { get; set; }
    }
}
