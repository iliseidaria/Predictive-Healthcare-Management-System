using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetMedicalRecordByIdQueryHandler : IRequestHandler<GetMedicalRecordByIdQuery, MedicalRecordDto>
    {
        public readonly IMedicalRecordRepository repository;
        public readonly IMapper mapper;

        public GetMedicalRecordByIdQueryHandler(IMedicalRecordRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<MedicalRecordDto> Handle(GetMedicalRecordByIdQuery request, CancellationToken cancellationToken)
        {
            var medicalRecord = await repository.GetMedicalRecordByIdAsync(request.Id);
            if (medicalRecord == null)
            {
                return null; // Return null without calling Map
            }
            return mapper.Map<MedicalRecordDto>(medicalRecord);
        }
    }
}
