using Domain.Entities;
using Infrastructure.Migrations;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
  public class UserRepository : IUserRepository
  {
    private readonly ApplicationDbContext context;

    public UserRepository(ApplicationDbContext context)
    {
      this.context = context;
    }
    public async Task<int> GetTotalUsersCountAsync()
    {
      return await context.Users.CountAsync();
    }

    public async Task<Guid> AddUserAsync(User patient)
    {
      await context.Users.AddAsync(patient);
      await context.SaveChangesAsync();
      return patient.Id;
    }

    public async Task<Guid> DeleteUserAsync(Guid id)
    {
      var patient = await context.Users.FirstOrDefaultAsync(x => x.Id == id);
      if (patient != null)
      {
        context.Users.Remove(patient);
        await context.SaveChangesAsync();
        return id;
      }
      return Guid.Empty;
    }

    public async Task<User> GetUserByIdAsync(Guid id)
    {
      return await context.Users.FindAsync(id);
    }

    public async Task<IEnumerable<User>> GetPatientsAsync()
    {
      return await context.Users.ToListAsync();
    }

    public async Task<List<User>> GetAllUsersAsync(int page, int size)
    {
      return await context.Users
        .OrderBy(p => p.Id)
        .Skip((page - 1) * size)
        .Take(size)
        .ToListAsync();
    }

    public async Task<bool> UpdateAsync(User patient)
    {
      context.Entry(patient).State = EntityState.Modified;
      return await context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateUserAsync(User user)
    {
      context.Entry(user).State = EntityState.Modified;
      context.Entry(user).Property(x => x.Username).IsModified = true;
      context.Entry(user).Property(x => x.Email).IsModified = true;
      context.Entry(user).Property(x => x.Role).IsModified = true;
      return await context.SaveChangesAsync() > 0;
    }

    public void Detach(User patient)
    {
      context.Entry(patient).State = EntityState.Detached;
    }
    public async Task<bool> UserExistsAsync(Guid patientId)
    {
      return await context.Users.AnyAsync(p => p.Id == patientId);
    }
  }
}
