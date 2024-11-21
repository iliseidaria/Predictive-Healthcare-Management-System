using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Entities;
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

            // Ensure the return is an empty list if no patients are found
            if (patients == null || !patients.Any())
            {
                return new List<PatientDTO>();
            }

            return mapper.Map<List<PatientDTO>>(patients);
        }
    }
}
