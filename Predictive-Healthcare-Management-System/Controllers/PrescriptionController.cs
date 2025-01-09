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
        public async Task<IActionResult> GetAllPrescriptions()
        {
            var prescriptions = await _mediator.Send(new GetPrescriptionsQuery());
            return Ok(prescriptions);
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
        public async Task<IActionResult> AddPrescription(AddPrescriptionCommand command)
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

          var prescriptionId = await _mediator.Send(command);
          Console.WriteLine($"Prescription created with ID: {prescriptionId}");
          return CreatedAtAction(nameof(GetPrescriptionById), new { id = prescriptionId }, new { id = prescriptionId });
    }

        // PUT: api/v1/Prescription/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePrescription(Guid id, [FromBody] UpdatePrescriptionCommand command)
        {
          if (id != command.PrescriptionId)
          {
            return BadRequest("Prescription ID in the URL does not match the request body.");
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
