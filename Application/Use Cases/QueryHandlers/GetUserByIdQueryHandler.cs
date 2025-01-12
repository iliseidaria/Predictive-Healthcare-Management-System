using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Infrastructure.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
  public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserDto>
  {
    public readonly IUserRepository repository;
    public readonly IMapper mapper;

    public GetUserByIdQueryHandler(IUserRepository repository, IMapper mapper)
    {
      this.repository = repository;
      this.mapper = mapper;
    }

    public async Task<UserDto> Handle(GetUserByIdQuery query, CancellationToken cancellationToken)
    {
      var user = await this.repository.GetUserByIdAsync(query.Id);

      if (user == null)
      {
        return null; // Return null without calling Map
      }

      return mapper.Map<UserDto>(user);
    }

  }
}
