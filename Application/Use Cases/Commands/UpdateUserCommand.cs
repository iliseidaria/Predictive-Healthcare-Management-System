using MediatR;

namespace Application.Use_Cases.Commands
{
  public class UpdateUserCommand : IRequest<Unit>
  {
    public Guid UserId { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string Role { get; set; }
  }
}
