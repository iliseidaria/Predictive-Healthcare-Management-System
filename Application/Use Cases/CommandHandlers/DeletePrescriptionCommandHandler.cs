using Application.Use_Cases.Commands;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.CommandHandlers
{
    public class DeletePrescriptionCommandHandler : IRequestHandler<DeletePrescriptionCommand, Guid>
    {
        private readonly IPrescriptionRepository _repository;

        public DeletePrescriptionCommandHandler(IPrescriptionRepository repository)
        {
            _repository = repository;
        }

        public async Task<Guid> Handle(DeletePrescriptionCommand request, CancellationToken cancellationToken)
        {
            return await _repository.DeletePrescriptionAsync(request.PrescriptionId);
        }
    }
}
