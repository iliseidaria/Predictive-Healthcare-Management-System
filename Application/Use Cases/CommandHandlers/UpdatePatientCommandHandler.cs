using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Entities;
using MediatR;
using System.ComponentModel.DataAnnotations;

namespace Application.CommandHandlers
{
    public class UpdatePatientCommandHandler : IRequestHandler<UpdatePatientCommand>
    {
        private readonly IPatientRepository repository;
        private readonly IMapper mapper;

        public UpdatePatientCommandHandler(IPatientRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task Handle(UpdatePatientCommand request, CancellationToken cancellationToken)
        {
            UpdatePatientCommandValidator validationRule = new UpdatePatientCommandValidator();
            var validator = validationRule.Validate(request);
            if (!validator.IsValid)
            {
                var errorsResult = new List<string>();
                foreach (var error in validator.Errors)
                {
                    errorsResult.Add(error.ErrorMessage);
                }
                throw new ValidationException(string.Join(", ", errorsResult));
            }

            // Check if the patient exists
            var existingPatient = await repository.GetPatientByIdAsync(request.PatientId);
            if (existingPatient == null)
            {
                throw new KeyNotFoundException("Patient not found");
            }


            repository.Detach(existingPatient);

            var p = mapper.Map<Patient>(request);
            await repository.UpdateAsync(p);
        }
    }
}