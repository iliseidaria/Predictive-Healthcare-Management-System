using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Use_Cases.CommandHandlers
{
    public class UpdateMedicalRecordCommandHandler : IRequestHandler<UpdateMedicalRecordCommand, Unit>
    {
        private readonly IMedicalRecordRepository repository;
        private readonly IMapper mapper;

        public UpdateMedicalRecordCommandHandler(IMedicalRecordRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<Unit> Handle(UpdateMedicalRecordCommand request, CancellationToken cancellationToken)
        {
            var existingRecord = await repository.GetMedicalRecordByIdAsync(request.RecordId);
            if (existingRecord == null)
            {
                throw new KeyNotFoundException("Record not found");
            }

            repository.Detach(existingRecord);

            var record = mapper.Map<MedicalRecord>(request);
            await repository.UpdateAsync(record);

            return Unit.Value;
        }
    }
}
