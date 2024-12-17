using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
  public class GetPatientsQueryHandler : IRequestHandler<GetPatientsQuery, (List<PatientDTO> Patients, int TotalCount)>
  {
    private readonly IPatientRepository repository;
    private readonly IMapper mapper;

    public GetPatientsQueryHandler(IPatientRepository repository, IMapper mapper)
    {
      this.repository = repository;
      this.mapper = mapper;
    }

    public async Task<(List<PatientDTO> Patients, int TotalCount)> Handle(GetPatientsQuery request, CancellationToken cancellationToken)
    {
      var totalPatients = await repository.GetTotalPatientsCountAsync(); // Adaugă o metodă pentru a obține totalul

      var patients = await repository.GetAllPatientsAsync(request.Page, request.Size);

      var mappedPatients = mapper.Map<List<PatientDTO>>(patients);

      return (mappedPatients, totalPatients);
    }

  }

}
