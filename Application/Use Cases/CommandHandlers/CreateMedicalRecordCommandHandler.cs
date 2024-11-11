using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class CreateMedicalRecordCommandHandler : IRequestHandler<CreateMedicalRecordCommand, Guid>
    {
        private readonly IMedicalRecordRepository repository;
        private readonly IMapper mapper;

        public CreateMedicalRecordCommandHandler(IMedicalRecordRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<Guid> Handle(CreateMedicalRecordCommand request, CancellationToken cancellationToken)
        {
            var record = mapper.Map<MedicalRecord>(request);
            return await repository.AddMedicalRecordAsync(record);
        }
    }
}
