using Application.DTOs;
using Application.Queries;
using AutoMapper;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
  public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, (List<UserDto> Patients, int TotalCount)>
  {
    private readonly IUserRepository repository;
    private readonly IMapper mapper;

    public GetAllUsersQueryHandler(IUserRepository repository, IMapper mapper)
    {
      this.repository = repository;
      this.mapper = mapper;
    }

    public async Task<(List<UserDto> Patients, int TotalCount)> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
      var totalPatients = await repository.GetTotalUsersCountAsync(); // Adaugă o metodă pentru a obține totalul

      var patients = await repository.GetAllUsersAsync(request.Page, request.Size);

      var mappedPatients = mapper.Map<List<UserDto>>(patients);

      return (mappedPatients, totalPatients);
    }

  }

}
