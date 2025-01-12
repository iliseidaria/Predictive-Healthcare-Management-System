using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Guid>
    {
        private readonly IUserRepository repository;
        private readonly IMapper mapper;

        public CreateUserCommandHandler(IUserRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<Guid> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
          request.DateOfBirth = DateTime.SpecifyKind(request.DateOfBirth, DateTimeKind.Utc);

          var patient = mapper.Map<User>(request);
                return await repository.AddUserAsync(patient);
        }
    }
}
