using Application.DTOs;
using Application.Use_Cases.Commands;
using Application.Use_Cases.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Predictive_Healthcare_Management_System.Controllers
{
  [Route("api/v1/[controller]")]
  [ApiController]
  [Authorize]
  public class PatientsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PatientsController(IMediator mediator)
        {
            _mediator = mediator;
        }

    [HttpGet]
    [Authorize(Policy = "RequireAdminOrDoctorRole")]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int size = 10)
    {
      var result = await _mediator.Send(new GetPatientsQuery
      {
        Page = page,
        Size = size
      });

      if (result == null || !result.Any())
      {
        Console.WriteLine("Authorization failed or no patients found");
        return NotFound("No patients found.");
      }

      return Ok(new { items = result, totalCount = result.Count });
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<PatientDTO>> GetById(Guid id)
        {
            var patient = await _mediator.Send(new GetPatientByIdQuery { Id = id });
            if (patient == null)
            {
                throw new NotFoundException(); // Use centralized error handling
            }
            return Ok(patient);
        }

    [HttpPost]
    [Authorize(Policy = "RequireAdminOrDoctorRole")]
    public async Task<IActionResult> Create(CreatePatientCommand command)
    {
      if (!ModelState.IsValid)
      {
        Console.WriteLine("Model state is invalid:");
        foreach (var modelState in ModelState.Values)
        {
          foreach (var error in modelState.Errors)
          {
            Console.WriteLine($"Error: {error.ErrorMessage}");
          }
        }
        return BadRequest(ModelState);  // Returnează eroarea exactă
      }

      var patientId = await _mediator.Send(command);
      Console.WriteLine($"Patient created with ID: {patientId}");
      return CreatedAtAction(nameof(GetById), new { id = patientId }, new { id = patientId });
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "RequireAdminOrDoctorRole")]
    public async Task<IActionResult> Delete(Guid id)
        {
            var patient = await _mediator.Send(new GetPatientByIdQuery { Id = id });
            if (patient == null)
            {
                throw new NotFoundException();
            }
            await _mediator.Send(new DeletePatientCommand { Id = id });
            return NoContent();
        }

    [HttpPut("{id}")]
    [Authorize(Policy = "RequireAdminOrPatientRole")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePatientCommand command)
    {
      if (id != command.PatientId)
      {
        return BadRequest("Patient ID in the URL does not match the request body.");
      }

      var patient = await _mediator.Send(new GetPatientByIdQuery { Id = id });
      if (patient == null)
      {
        return NotFound("Patient not found.");
      }

      await _mediator.Send(command);
      return NoContent(); // Return status 204
    }
  }
}
