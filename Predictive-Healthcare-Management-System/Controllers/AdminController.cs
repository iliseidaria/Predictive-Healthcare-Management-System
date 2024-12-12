using Application.DTOs;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Predictive_Healthcare_Management_System.Controllers
{
  [Route("api/v1/[controller]")]
  [ApiController]
  [Authorize(Policy = "RequireAdminRole")]
  public class AdminController : ControllerBase
  {
    private readonly ApplicationDbContext _context;

    public AdminController(ApplicationDbContext context)
    {
      _context = context;
    }

    // GET: api/v1/Admin/users
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
      var users = await _context.Users.ToListAsync();
      return Ok(users);
    }

    // GET: api/v1/Admin/users/{id}
    [HttpGet("users/{id}")]
    public async Task<IActionResult> GetUserById(int id)
    {
      var user = await _context.Users.FindAsync(id);
      if (user == null)
      {
        return NotFound("User not found.");
      }
      return Ok(user);
    }

    // PUT: api/v1/Admin/users/{id}
    [HttpPut("users/{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UserDto updateUserDto)
    {
      var user = await _context.Users.FindAsync(id);
      if (user == null)
      {
        return NotFound("User not found.");
      }

      user.Username = updateUserDto.Username;
      user.Email = updateUserDto.Email;
      user.Role = updateUserDto.Role;

      _context.Users.Update(user);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    // DELETE: api/v1/Admin/users/{id}
    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
      var user = await _context.Users.FindAsync(id);
      if (user == null)
      {
        return NotFound("User not found.");
      }

      _context.Users.Remove(user);
      await _context.SaveChangesAsync();

      return NoContent();
    }
  }
}
