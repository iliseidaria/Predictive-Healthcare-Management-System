using MediatR;

namespace Application.Use_Cases.Commands
{
    public class DeleteAppointmentCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }
}
