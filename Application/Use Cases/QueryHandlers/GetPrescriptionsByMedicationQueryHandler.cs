using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetPrescriptionsByMedicationQueryHandler : IRequestHandler<GetPrescriptionsByMedicationQuery, List<PrescriptionDTO>>
    {
        private readonly IPrescriptionRepository _repository;
        private readonly IMapper _mapper;

        public GetPrescriptionsByMedicationQueryHandler(IPrescriptionRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<PrescriptionDTO>> Handle(GetPrescriptionsByMedicationQuery request, CancellationToken cancellationToken)
        {
            var prescriptions = await _repository.GetAllPrescriptionsAsync();
            var filteredPrescriptions = prescriptions
                .Where(p => p.MedicationName.Contains(request.MedicationName))
                .ToList();
            return _mapper.Map<List<PrescriptionDTO>>(filteredPrescriptions);
        }
    }
}
