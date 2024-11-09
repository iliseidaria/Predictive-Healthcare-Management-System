using MediatR;

namespace Application.Use_Cases.Commands
{
    public class DeletePatientCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }
}