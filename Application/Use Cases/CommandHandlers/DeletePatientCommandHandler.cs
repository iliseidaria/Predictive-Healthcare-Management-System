using Application.Use_Cases.Commands;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class DeletePatientCommandHandler : IRequestHandler<DeletePatientCommand, Unit>
    {
        private readonly IPatientRepository repository;

        public DeletePatientCommandHandler(IPatientRepository repository)
        {
            this.repository = repository;
        }
        public async Task<Unit> Handle(DeletePatientCommand request, CancellationToken cancellationToken)
        {
            // Check if the patient exists
            var existingPatient = await repository.GetPatientByIdAsync(request.Id);
            if (existingPatient == null)
            {
                throw new KeyNotFoundException("Patient not found");
            }

            // Delete the patient
            await repository.DeletePatientAsync(request.Id);

            return Unit.Value;
        }
    }
}
