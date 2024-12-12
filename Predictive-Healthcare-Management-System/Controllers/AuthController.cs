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
      try
      {
        var token = await _authService.Login(loginDto);
        return Ok(new { Token = token });
      }
      catch (Exception ex)
      {
        return Unauthorized(ex.Message);
      }
    }
  }
}
