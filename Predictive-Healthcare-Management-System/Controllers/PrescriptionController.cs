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
    public class PrescriptionController : ControllerBase
    {
        private readonly IMediator _mediator;
        public PrescriptionController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/v1/Prescription
        [HttpGet]
        [Authorize(Policy = "RequireAdminOrDoctorRole")]
        public async Task<IActionResult> GetAllPrescriptions([FromQuery] int page = 1, [FromQuery] int size = 10)
        {
            var (result, totalCount) = await _mediator.Send(new GetPrescriptionsQuery
            {
              Page = page,
              Size = size
            });

            if (result == null || !result.Any())
            {
              Console.WriteLine("Authorization failed or no prescriptions found");
              return NotFound("No prescriptions found.");
            }

            return Ok(new
            {
              items = result,
              totalCount = totalCount,
              currentPage = page,
              pageSize = size
            });
        }

        // GET: api/v1/Prescription/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPrescriptionById(Guid id)
        {
            var prescription = await _mediator.Send(new GetPrescriptionByIdQuery(id));
            if (prescription == null)
            {
                return NotFound("Prescription not found.");
            }
            return Ok(prescription);
        }

        // POST: api/v1/Prescription
        [HttpPost]
        [Authorize(Policy = "RequireDoctorRole")]
        public async Task<IActionResult> AddPrescription(AddPrescriptionCommand command)
        {
          if (!ModelState.IsValid)
          {
            return BadRequest(ModelState);
          }

          var prescriptionId = await _mediator.Send(command);
          Console.WriteLine($"Prescription created with ID: {prescriptionId}");
          return CreatedAtAction(nameof(GetPrescriptionById), new { id = prescriptionId }, new { id = prescriptionId });
    }

        // PUT: api/v1/Prescription/{id}
        [HttpPut("{id}")]
        [Authorize(Policy = "RequireDoctorRole")]
        public async Task<IActionResult> UpdatePrescription(Guid id, [FromBody] UpdatePrescriptionCommand command)
        {
          if (id != command.PrescriptionId)
          {
            return BadRequest("Prescription ID in the URL does not match the request body.");
          }

          if (!ModelState.IsValid)
          {
            return BadRequest(ModelState);
          }

          var prescription = await _mediator.Send(new GetPrescriptionByIdQuery(id));
          if (prescription == null)
          {
            return NotFound("Prescription not found.");
          }

          await _mediator.Send(command);
          return NoContent(); // Return status 204
        }

        // DELETE: api/v1/Prescription/{id}
        [HttpDelete("{id}")]
        [Authorize(Policy = "RequireDoctorRole")]
        public async Task<IActionResult> DeletePrescription(Guid id)
        {
            var prescription = await _mediator.Send(new GetPrescriptionByIdQuery(id));
            if (prescription == null)
            {
                throw new NotFoundException();
            }
            await _mediator.Send(new DeletePrescriptionCommand { Id = id });
            return NoContent();
        }
    }
}
