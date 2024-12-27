using Application.DTOs;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
  public class UserService
  {
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
      _context = context;
    }

    public async Task<List<User>> GetAllUsersAsync()
    {
      return await _context.Users.ToListAsync();
    }

        public async Task<User?> GetUserByIdAsync(Guid id)
        {
            return await _context.Users.FindAsync(id);
        }

    public async Task<bool> UpdateUserAsync(UserDto updateUserDto)
    {
      var user = await _context.Users.FindAsync(updateUserDto.Id);
      if (user == null)
      {
        return false;
      }

      user.Username = updateUserDto.Username;
      user.Email = updateUserDto.Email;
      user.Role = updateUserDto.Role;

      _context.Users.Update(user);
      await _context.SaveChangesAsync();
      return true;
    }

    public async Task<bool> DeleteUserAsync(Guid id)
    {
      var user = await _context.Users.FindAsync(id);
      if (user == null)
      {
        return false;
      }

      _context.Users.Remove(user);
      await _context.SaveChangesAsync();
      return true;
    }
  }
}
