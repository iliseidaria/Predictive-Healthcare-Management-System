using Microsoft.AspNetCore.Mvc;
using Application.DTOs;

namespace Predictive_Healthcare_Management_System.Controllers
{
  [Route("api/v1/[controller]")]
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
      _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState); // Return validation errors
      }

      try
      {
        var result = await _authService.Register(registerDto);
        if (result == "User already exists" || result == "Email already registered")
        {
          return BadRequest(new { Error = result });
        }
        return Ok(new { Message = result });
      }
      catch (Exception ex)
      {
        return BadRequest(new { Error = ex.Message });
      }
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState); // Return validation errors
      }

      try
      {
        var result = await _authService.Login(loginDto);
        if (result == "Invalid username/email or password")
        {
          return Unauthorized(new { Error = result });
        }

        return Ok(new { Token = result });
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { Error = ex.Message });
      }
    }
  }
}
