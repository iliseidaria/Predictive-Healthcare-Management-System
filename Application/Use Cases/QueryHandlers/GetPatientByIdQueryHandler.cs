using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetPatientByIdQueryHandler : IRequestHandler<GetPatientByIdQuery, PatientDto>
    {
        public readonly IPatientRepository repository;
        public readonly IMapper mapper;

        public GetPatientByIdQueryHandler(IPatientRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<PatientDto> Handle(GetPatientByIdQuery request, CancellationToken cancellationToken)
        {
            var patient = await repository.GetPatientByIdAsync(request.Id);
            if (patient == null)
            {
                return null; // Return null without calling Map
            }
            return mapper.Map<PatientDto>(patient);
        }
    }
}
