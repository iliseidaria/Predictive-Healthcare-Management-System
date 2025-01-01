using Application.DTOs;
using Application.Queries;
using Infrastructure.Persistence;
using MediatR;
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
    private readonly IMediator _mediator;

    public AdminController(ApplicationDbContext context, IMediator mediator)
    {
      _context = context;
      _mediator = mediator;
    }

    // GET: api/v1/Admin/users
    //[HttpGet("users")]
    //public async Task<IActionResult> GetAllUsers()
    //{
    //  var users = await _context.Users.ToListAsync();
    //  return Ok(users);
    //}
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers([FromQuery] int page = 1, [FromQuery] int size = 10)
    {
      var query = new GetAllUsersQuery(page, size);
      var response = await _mediator.Send(query);
      return Ok(response);
    }

    // GET: api/v1/Admin/users/{id}
    [HttpGet("users/{id}")]
    public async Task<IActionResult> GetUserById(Guid id)
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
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UserDto updateUserDto)
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
    public async Task<IActionResult> DeleteUser(Guid id)
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
