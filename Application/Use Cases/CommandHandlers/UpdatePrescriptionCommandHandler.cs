using Application.Use_Cases.Commands;
using Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.CommandHandlers
{
    public class UpdatePrescriptionCommandHandler : IRequestHandler<UpdatePrescriptionCommand, bool>
    {
        private readonly IPrescriptionRepository _repository;

        public UpdatePrescriptionCommandHandler(IPrescriptionRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> Handle(UpdatePrescriptionCommand request, CancellationToken cancellationToken)
        {
            var prescription = new Prescription
            {
                PrescriptionId = request.PrescriptionId,
                MedicationName = request.MedicationName,
                Dosage = request.Dosage,
                Frequency = request.Frequency,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Notes = request.Notes
            };

            return await _repository.UpdateAsync(prescription);
        }
    }
}
