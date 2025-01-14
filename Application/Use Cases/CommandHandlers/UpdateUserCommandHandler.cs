using Application.Use_Cases.Commands;
using AutoMapper;
using MediatR;

namespace Application.CommandHandlers
{
  public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, Unit>
  {
    private readonly IUserRepository repository;
    private readonly IMapper mapper;

    public UpdateUserCommandHandler(IUserRepository repository, IMapper mapper)
    {
      this.repository = repository;
      this.mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
      var existingPatient = await repository.GetUserByIdAsync(request.UserId);
      if (existingPatient == null)
      {
        throw new KeyNotFoundException("Patient not found");
      }

      // Update only modified properties
      existingPatient.Username = request.Username;
      existingPatient.Email = request.Email;
      existingPatient.Role = request.Role;

      // Update using existing entity
      await repository.UpdateUserAsync(existingPatient);

      return Unit.Value;
    }
  }
}
