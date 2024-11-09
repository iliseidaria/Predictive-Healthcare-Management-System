using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class CreatePatientCommandHandler : IRequestHandler<CreatePatientCommand, Guid>
    {
        private readonly IPatientRepository repository;
        private readonly IMapper mapper;

        public CreatePatientCommandHandler(IPatientRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<Guid> Handle(CreatePatientCommand request, CancellationToken cancellationToken)
        {
            var patient = mapper.Map<Patient>(request);
            return await repository.AddPatientAsync(patient);
        }
    }
}
