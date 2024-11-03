using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetPatientByIdQueryHandler : IRequestHandler<GetPatientByIdQuery, PatientDTO>
    {
        public readonly IPatientRepository repository;
        public readonly IMapper mapper;

        public GetPatientByIdQueryHandler(IPatientRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<PatientDTO> Handle(GetPatientByIdQuery request, CancellationToken cancellationToken)
        {
            var patient = await repository.GetPatientByIdAsync(request.Id);
            return mapper.Map<PatientDTO>(patient);
        }
    }
}
