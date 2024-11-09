using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.CommandHandlers
{
    public class UpdatePatientCommandHandler : IRequestHandler<UpdatePatientCommand, Unit>
    {
        private readonly IPatientRepository repository;
        private readonly IMapper mapper;

        public UpdatePatientCommandHandler(IPatientRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Unit> Handle(UpdatePatientCommand request, CancellationToken cancellationToken)
        {
            // Check if the patient exists
            var existingPatient = await repository.GetPatientByIdAsync(request.PatientId);
            if (existingPatient == null)
            {
                throw new KeyNotFoundException("Patient not found");
            }

            repository.Detach(existingPatient);

            var patient = mapper.Map<Patient>(request);
            await repository.UpdateAsync(patient);

            return Unit.Value;
        }
    }
}