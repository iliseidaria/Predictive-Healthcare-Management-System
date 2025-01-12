using Application.DTOs;
using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.Queries
{
  public class GetUserByIdQuery : IRequest<UserDto>
  {
    public Guid Id { get; set; }
  }
}
