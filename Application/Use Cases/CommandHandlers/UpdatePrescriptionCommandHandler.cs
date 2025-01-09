using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.CommandHandlers
{
    public class UpdatePrescriptionCommandHandler : IRequestHandler<UpdatePrescriptionCommand, Unit>
    {
        private readonly IPrescriptionRepository _repository;
        private readonly IMapper _mapper;

        public UpdatePrescriptionCommandHandler(IPrescriptionRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(UpdatePrescriptionCommand request, CancellationToken cancellationToken)
        {
            // Check if the patient exists
            var existingPrescription = await _repository.GetPrescriptionByIdAsync(request.PrescriptionId);
            if (existingPrescription == null)
            {
                throw new KeyNotFoundException("Prescription not found");
            }

            _repository.Detach(existingPrescription);

            var prescription = _mapper.Map<Prescription>(request);
            await _repository.UpdateAsync(prescription);

            return Unit.Value;
        }
    }
}
