using Application.Use_Cases.Commands;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.CommandHandlers
{
    public class DeletePrescriptionCommandHandler : IRequestHandler<DeletePrescriptionCommand, Unit>
    {
        private readonly IPrescriptionRepository _repository;

        public DeletePrescriptionCommandHandler(IPrescriptionRepository repository)
        {
            _repository = repository;
        }

        public async Task<Unit> Handle(DeletePrescriptionCommand request, CancellationToken cancellationToken)
        {
          // Check if the patient exists
          var existingPrescription = await _repository.GetPrescriptionByIdAsync(request.Id);
          if (existingPrescription == null)
          {
            throw new KeyNotFoundException("Prescription not found");
          }

          // Delete the patient
          await _repository.DeletePrescriptionAsync(request.Id);

          return Unit.Value;
        }
    }
}
