using Application.Use_Cases.Commands;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class DeleteMedicalRecordCommandHandler : IRequestHandler<DeleteMedicalRecordCommand, Unit>
    {
        private readonly IMedicalRecordRepository repository;

        public DeleteMedicalRecordCommandHandler(IMedicalRecordRepository repository)
        {
            this.repository = repository;
        }

        public async Task<Unit> Handle(DeleteMedicalRecordCommand request, CancellationToken cancellationToken)
        {
            var existingMedicalRecord = await repository.GetMedicalRecordByIdAsync(request.Id);
            if (existingMedicalRecord == null)
            {
                throw new KeyNotFoundException("Medical record not found");
            }

            // Delete the medical record
            await repository.DeleteMedicalRecordAsync(request.Id);

            return Unit.Value;
        }
    }
}
