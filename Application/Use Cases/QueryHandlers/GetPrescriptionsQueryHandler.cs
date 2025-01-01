using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetPrescriptionsQueryHandler : IRequestHandler<GetPrescriptionsQuery, List<PrescriptionDTO>>
    {
        private readonly IPrescriptionRepository _repository;
        private readonly IMapper _mapper;

        public GetPrescriptionsQueryHandler(IPrescriptionRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<PrescriptionDTO>> Handle(GetPrescriptionsQuery request, CancellationToken cancellationToken)
        {
            var prescriptions = await _repository.GetAllPrescriptionsAsync();
            return _mapper.Map<List<PrescriptionDTO>>(prescriptions);
        }
    }
}
