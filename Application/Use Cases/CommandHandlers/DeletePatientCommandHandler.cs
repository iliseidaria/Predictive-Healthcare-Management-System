using Application.Use_Cases.Commands;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class DeletePatientCommandHandler : IRequestHandler<DeletePatientCommand, Unit>
    {
        private readonly  IUserRepository repository;

        public DeletePatientCommandHandler(IUserRepository repository)
        {
            this.repository = repository;
        }
        public async Task<Unit> Handle(DeletePatientCommand request, CancellationToken cancellationToken)
        {
            // Check if the patient exists
            var existingPatient = await repository.GetUserByIdAsync(request.Id);
            if (existingPatient == null)
            {
                throw new KeyNotFoundException("Patient not found");
            }

            // Delete the patient
            await repository.DeleteUserAsync(request.Id);

            return Unit.Value;
        }
    }
}
