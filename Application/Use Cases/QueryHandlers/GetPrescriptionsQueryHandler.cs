using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.Handlers
{
  public class GetPrescriptionsQueryHandler : IRequestHandler<GetPrescriptionsQuery, (List<PrescriptionDto> Prescriptions, int TotalCount)>
  {
    private readonly IPrescriptionRepository _repository;
    private readonly IMapper _mapper;

    public GetPrescriptionsQueryHandler(IPrescriptionRepository repository, IMapper mapper)
    {
      _repository = repository;
      _mapper = mapper;
    }

    public async Task<(List<PrescriptionDto> Prescriptions, int TotalCount)> Handle(GetPrescriptionsQuery request, CancellationToken cancellationToken)
    {
      var totalCount = await _repository.GetTotalCountAsync();
      var prescriptions = await _repository.GetAllPrescriptionsAsync(request.Page, request.Size);

      var mappedPrescriptions = _mapper.Map<List<PrescriptionDto>>(prescriptions);

      return (mappedPrescriptions, totalCount);
    }
  }
}
