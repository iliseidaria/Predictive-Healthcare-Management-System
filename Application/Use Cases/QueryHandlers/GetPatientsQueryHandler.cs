using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetPatientsQueryHandler : IRequestHandler<GetPatientsQuery, List<PatientDTO>>
    {
        private readonly IPatientRepository repository;
        private readonly IMapper mapper;

        public GetPatientsQueryHandler(IPatientRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<List<PatientDTO>> Handle(GetPatientsQuery request, CancellationToken cancellationToken)
        {
            var patients = await repository.GetAllPatientsAsync();
            return mapper.Map<List<PatientDTO>>(patients);
        }
    }
}
