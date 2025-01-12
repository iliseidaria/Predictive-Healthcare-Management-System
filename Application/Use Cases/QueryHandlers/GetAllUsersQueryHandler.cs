using Application.Queries;
using Application.DTOs;
using Infrastructure.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Handlers
{
  public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, GetAllUsersResponse>
  {
    private readonly ApplicationDbContext _context;

    public GetAllUsersQueryHandler(ApplicationDbContext context)
    {
      _context = context;
    }

    public async Task<GetAllUsersResponse> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
      var totalUsers = await _context.Users.CountAsync(cancellationToken);
      var users = await _context.Users
          .Skip((request.Page - 1) * request.Size)
          .Take(request.Size)
          .Select(u => new UserDto
          {
            Id = u.Id,
            Username = u.Username,
            Email = u.Email,
            Role = u.Role,
            //UserType =u.UserType
          })
          .ToListAsync(cancellationToken);

      return new GetAllUsersResponse(totalUsers, users);
    }
  }
}

