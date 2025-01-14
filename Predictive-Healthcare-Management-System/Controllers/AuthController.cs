using Microsoft.AspNetCore.Mvc;
using Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Application.Use_Cases.Queries;
using MediatR;
using Application.Queries;
using Application.Use_Cases.Commands;

namespace Predictive_Healthcare_Management_System.Controllers
{
  [Route("api/v1/[controller]")]
  [ApiController]
  [Authorize]
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
    [AllowAnonymous]
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
    [AllowAnonymous]
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
    [AllowAnonymous]
    public async Task<bool> CheckDoctorIdExists(string doctorId)
    {
      var query = new GetDoctorByIdQuery { DoctorId = doctorId };
      var result = await _mediator.Send(query);
      return result;
    }

    // GET: /api/v1/Auth/users
    [HttpGet("users")]
    [Authorize(Policy = "RequireAdminOrDoctorRole")]
        public async Task<IActionResult> GetAllUsers([FromQuery] int page = 1, [FromQuery] int size = 10)
        {
            var query = new GetAllUsersQuery
            {
                Page = page,
                Size = size
            };

            var (result, totalCount) = await _mediator.Send(query);

            if (result == null || !result.Any())
            {
                Console.WriteLine("Authorization failed or no patients found");
                return NotFound("No patients found.");
            }

            return Ok(new
            {
                items = result,
                totalCount = totalCount,
                currentPage = page,
                pageSize = size
            });
        }


    [HttpGet("users/{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<UserDto>> GetUserById(Guid id)
    {
      var patient = await _mediator.Send(new GetUserByIdQuery { Id = id });
      if (patient == null)
      {
        throw new NotFoundException(); // Use centralized error handling
      }
      return Ok(patient);
    }

    [HttpDelete("users/{id}")]
    [Authorize(Policy = "RequireAdminOrDoctorRole")]
    public async Task<IActionResult> Delete(Guid id)
    {
      var patient = await _mediator.Send(new GetUserByIdQuery { Id = id });
      if (patient == null)
      {
        throw new NotFoundException();
      }
      await _mediator.Send(new DeletePatientCommand { Id = id });
      return NoContent();
    }

    [HttpPut("users/{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePatientCommand command)
    {
      if (id != command.PatientId)
      {
        return BadRequest("Patient ID in the URL does not match the request body.");
      }

      var patient = await _mediator.Send(new GetUserByIdQuery { Id = id });
      if (patient == null)
      {
        return NotFound("Patient not found.");
      }

      await _mediator.Send(command);
      return NoContent(); // Return status 204
    }

    [HttpPut("users/edit/{id}")]
    [Authorize(Policy = "RequireAdminRole")]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserCommand command)
    {
      if (id != command.UserId)
      {
        return BadRequest("User ID in the URL does not match the request body.");
      }

      var patient = await _mediator.Send(new GetUserByIdQuery { Id = id });
      if (patient == null)
      {
        return NotFound("User not found.");
      }

      await _mediator.Send(command);
      return NoContent(); // Return status 204
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
