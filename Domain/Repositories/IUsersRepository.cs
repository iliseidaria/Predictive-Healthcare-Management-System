
using Domain.Entities;

public interface IUserRepository
{
  Task<List<User>> GetAllUsersAsync(int page, int size);
  Task<User> GetUserByIdAsync(Guid userId);
  Task<bool> UpdateAsync(User user);
  Task<bool> UpdateUserAsync(User user);
  Task<Guid> DeleteUserAsync(Guid userId);
  Task<Guid> AddUserAsync(User user);
  void Detach(User existingUser);
  Task<bool> UserExistsAsync(Guid userId);
  Task<int> GetTotalUsersCountAsync();
}
