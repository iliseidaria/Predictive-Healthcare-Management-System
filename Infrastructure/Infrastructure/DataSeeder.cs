using Domain.Entities;
using Infrastructure.Persistence;

public static class DataSeeder
{
  public static void SeedAdminUser(ApplicationDbContext context)
  {
    if (!context.Users.Any(u => u.Role == "Admin"))
    {
      var adminUser = new User
      {
        Username = "admin",
        Email = "admin@admin.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
        Role = "Admin"
      };

      context.Users.Add(adminUser);
      context.SaveChanges();
    }
  }
}
