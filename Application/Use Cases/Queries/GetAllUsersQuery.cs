using Application.DTOs;
using MediatR;

namespace Application.Queries
{
    public class GetAllUsersQuery : IRequest<(List<UserDto> Patients, int TotalCount)>
    {
    public int Page { get; set; } = 1;  // Pagina implicită
    public int Size { get; set; } = 10; // Mărimea implicită
  }
}
