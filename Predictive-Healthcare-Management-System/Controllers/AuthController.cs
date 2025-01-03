using Microsoft.AspNetCore.Mvc;
using Application.DTOs;
using Microsoft.AspNetCore.Authorization;

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

    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout()
    {
      try
      {
        var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

        // You can implement token blacklisting here if needed
        // For now, we'll just return success since the client will remove the token

        return Ok(new { message = "Logged out successfully" });
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { message = "Error during logout", error = ex.Message });
      }
    }
  }
}
