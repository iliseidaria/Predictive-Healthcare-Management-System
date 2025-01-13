using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetMedicalRecordByUserIdQueryHandler : IRequestHandler<GetMedicalRecordByUserIdQuery, List<MedicalRecord>>
    {
        public readonly IMedicalRecordRepository repository;
        public readonly IMapper mapper;

        public GetMedicalRecordByUserIdQueryHandler(IMedicalRecordRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<List<MedicalRecord>> Handle(GetMedicalRecordByUserIdQuery request, CancellationToken cancellationToken)
        {
            var medicalRecords = await repository.GetAllByPatientIdAsync(request.Id, request.Page, request.Size);
            if (medicalRecords == null)
            {
                return null; // Return null without calling Map
             }
            return mapper.Map<List<MedicalRecord>>(medicalRecords);
    }
    }
}
