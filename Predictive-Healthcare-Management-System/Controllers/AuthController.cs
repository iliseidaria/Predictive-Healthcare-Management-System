using Microsoft.AspNetCore.Mvc;
using Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Application.Use_Cases.Queries;
using MediatR;

namespace Predictive_Healthcare_Management_System.Controllers
{
  [Route("api/v1/[controller]")]
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly AuthService _authService;
    private readonly IMediator _mediator;

    public AuthController(AuthService authService, IMediator mediator)
    {
      _authService = authService;
      _mediator = mediator;
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

    [HttpGet("validate-doctor/{doctorId}")]
    public async Task<bool> CheckDoctorIdExists(string doctorId)
    {
      var query = new GetDoctorByIdQuery { DoctorId = doctorId };
      var result = await _mediator.Send(query);
      return result;
    }

    [HttpGet("doctors")]
    public async Task<IActionResult> GetAllDoctors(Guid id)
    {
      var prescriptions = await _mediator.Send(new GetPrescriptionsByPatientIdQuery { PatientId = id });
      if (prescriptions == null || !prescriptions.Any())
      {
        return NotFound("No prescriptions found for the specified patient.");
      }
      return Ok(prescriptions);
    }

    // de pus in controllerul cu pacienti cred
    //[HttpGet("users/{id}")]
    //public async Task<ActionResult<UserDto>> GetById(Guid id)
    //{
    //  var result = await _mediator.Send(new GetUserByIdQuery { Id = id });
    //  if (result == null)
    //  {
    //    throw new UserNotFound(); // Use centralized error handling
    //  }
    //  return Ok(result);
    //}

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
