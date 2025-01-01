using Application.DTOs;

namespace Application.Queries
{
  public class GetAllUsersResponse
  {
    public int TotalUsers { get; set; }
    public List<UserDto> Users { get; set; }

    public GetAllUsersResponse(int totalUsers, List<UserDto> users)
    {
      TotalUsers = totalUsers;
      Users = users;
    }
  }
}
