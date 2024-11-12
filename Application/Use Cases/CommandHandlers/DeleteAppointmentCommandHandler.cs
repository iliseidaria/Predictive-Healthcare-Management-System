using Application.Use_Cases.Commands;
using Infrastructure.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class DeleteAppointmentCommandHandler : IRequestHandler<DeleteAppointmentCommand, Unit>
    {
        private readonly IAppointmentRepository repository;

        public DeleteAppointmentCommandHandler(IAppointmentRepository repository)
        {
            this.repository = repository;
        }
        public async Task<Unit> Handle(DeleteAppointmentCommand request, CancellationToken cancellationToken)
        {
            // Check if the appointment exists
            var existingAppointment = await repository.GetAppointmentByIdAsync(request.Id);
            if (existingAppointment == null)
            {
                throw new KeyNotFoundException("Appointment not found");
            }

            // Delete the appointment
            await repository.DeleteAppointmentAsync(request.Id);

            return Unit.Value;
        }
    }
}
