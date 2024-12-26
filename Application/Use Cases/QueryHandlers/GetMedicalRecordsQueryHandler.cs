using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetMedicalRecordsQueryHandler : IRequestHandler<GetMedicalRecordsQuery, List<MedicalRecordDto>>
    {
        private readonly IMedicalRecordRepository repository;
        private readonly IMapper mapper;

        public GetMedicalRecordsQueryHandler(IMedicalRecordRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<List<MedicalRecordDto>> Handle(GetMedicalRecordsQuery request, CancellationToken cancellationToken)
        {
            var records = await repository.GetMedicalRecordsAsync();
            return mapper.Map<List<MedicalRecordDto>>(records);
        }
    }
}
