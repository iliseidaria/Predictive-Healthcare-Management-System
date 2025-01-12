using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class CreateUserCommand : IRequest<Guid>
    {
      public required string Username { get; set; }
      public required string Email { get; set; }
      public required string Role { get; set; }
      public required string UserType { get; set; }
      public string FirstName { get; set; }
      public string LastName { get; set; }
      public DateTime DateOfBirth { get; set; }
      public string Gender { get; set; }
      public string ContactInformation { get; set; }
      public string Address { get; set; }
      public string PhotoPath { get; set; }

}
}
