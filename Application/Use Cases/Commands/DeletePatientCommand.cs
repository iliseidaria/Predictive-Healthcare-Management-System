using MediatR;

namespace Application.Use_Cases.Commands
{
    public class DeletePatientCommand : IRequest
    {
        public Guid Id { get; set; }
    }
}