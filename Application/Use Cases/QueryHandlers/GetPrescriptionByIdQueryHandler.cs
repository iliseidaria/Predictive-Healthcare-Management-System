using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetPrescriptionByIdQueryHandler : IRequestHandler<GetPrescriptionByIdQuery, PrescriptionDto>
    {
        private readonly IPrescriptionRepository _repository;
        private readonly IMapper _mapper;

        public GetPrescriptionByIdQueryHandler(IPrescriptionRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<PrescriptionDto> Handle(GetPrescriptionByIdQuery request, CancellationToken cancellationToken)
        {
            var prescription = await _repository.GetPrescriptionByIdAsync(request.PrescriptionId);
            return _mapper.Map<PrescriptionDto>(prescription);
        }
    }
}
