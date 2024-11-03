using Application.Use_Cases.Commands;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class DeletePatientCommandHandler : IRequestHandler<DeletePatientCommand>
    {
        private readonly IPatientRepository repository;

        public DeletePatientCommandHandler(IPatientRepository repository)
        {
            this.repository = repository;
        }
        public async Task Handle(DeletePatientCommand request, CancellationToken cancellationToken)
        {
            await repository.DeletePatientAsync(request.Id);
        }
    }
}
