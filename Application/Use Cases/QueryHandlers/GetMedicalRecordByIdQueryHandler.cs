using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetMedicalRecordByIdQueryHandler : IRequestHandler<GetMedicalRecordByIdQuery, MedicalRecordDTO>
    {
        public readonly IMedicalRecordRepository repository;
        public readonly IMapper mapper;

        public GetMedicalRecordByIdQueryHandler(IMedicalRecordRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<MedicalRecordDTO> Handle(GetMedicalRecordByIdQuery request, CancellationToken cancellationToken)
        {
            var medicalRecord = await repository.GetMedicalRecordByIdAsync(request.Id);
            return mapper.Map<MedicalRecordDTO>(medicalRecord);
        }
    }
}
