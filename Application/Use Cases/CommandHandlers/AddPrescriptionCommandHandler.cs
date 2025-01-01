using Application.Use_Cases.Commands;
using Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.CommandHandlers
{
    public class AddPrescriptionCommandHandler : IRequestHandler<AddPrescriptionCommand, Guid>
    {
        private readonly IPrescriptionRepository _repository;

        public AddPrescriptionCommandHandler(IPrescriptionRepository repository)
        {
            _repository = repository;
        }

        public async Task<Guid> Handle(AddPrescriptionCommand request, CancellationToken cancellationToken)
        {
            var prescription = new Prescription
            {
                PrescriptionId = Guid.NewGuid(),
                MedicationName = request.MedicationName,
                Dosage = request.Dosage,
                Frequency = request.Frequency,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Notes = request.Notes
            };

            return await _repository.AddPrescriptionAsync(prescription);
        }
    }
}
