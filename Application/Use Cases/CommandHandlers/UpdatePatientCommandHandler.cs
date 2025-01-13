using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.CommandHandlers
{
    public class UpdatePatientCommandHandler : IRequestHandler<UpdatePatientCommand, Unit>
    {
        private readonly IUserRepository repository;
        private readonly IMapper mapper;

        public UpdatePatientCommandHandler(IUserRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

    //  public async Task<Unit> Handle(UpdatePatientCommand request, CancellationToken cancellationToken)
    //  {
    //      // Check if the patient exists
    //      var existingPatient = await repository.GetUserByIdAsync(request.PatientId);
    //      if (existingPatient == null)
    //      {
    //          throw new KeyNotFoundException("Patient not found");
    //      }

    //repository.Detach(existingPatient);

    //var patient = mapper.Map<User>(request);
    //      await repository.UpdateAsync(patient);

    //      return Unit.Value;
    //  }
    public async Task<Unit> Handle(UpdatePatientCommand request, CancellationToken cancellationToken)
    {
      var existingPatient = await repository.GetUserByIdAsync(request.PatientId);
      if (existingPatient == null)
      {
        throw new KeyNotFoundException("Patient not found");
      }

      // Update only modified properties
      existingPatient.FirstName = request.FirstName;
      existingPatient.LastName = request.LastName;
      existingPatient.DateOfBirth = request.DateOfBirth;
      existingPatient.Gender = request.Gender.ToString();
      existingPatient.ContactInformation = request.ContactInformation;
      existingPatient.Address = request.Address;
      existingPatient.PhotoPath = request.PhotoPath;

      // Update using existing entity
      await repository.UpdateAsync(existingPatient);

      return Unit.Value;
    }
  }
}
