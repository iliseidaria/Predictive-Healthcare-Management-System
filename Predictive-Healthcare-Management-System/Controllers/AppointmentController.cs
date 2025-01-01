using Application.DTOs;
using Application.Queries;
using Application.Use_Cases.Commands;
using Application.Use_Cases.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Predictive_Healthcare_Management_System.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AppointmentController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _mediator.Send(new GetAppointmentQuery()
            {
              Reason = string.Empty // Set a default value for the required property
            });
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDto>> GetById(Guid id)
        {
            var result = await _mediator.Send(new GetAppointmentByIdQuery { Id = id });
            if (result == null)
            {
                throw new AppointmentNotFound(); // Use centralized error handling
            }
            return Ok(result);
        }

        // GET: api/v1/Appointment/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserAppointments(Guid userId, [FromQuery] int page = 1, [FromQuery] int size = 10)
        {
          var query = new GetUserAppointmentsQuery(userId, page, size);
          var response = await _mediator.Send(query);
          return Ok(response);
        }

    [HttpPost]
        public async Task<IActionResult> CreateAppointment(CreateAppointmentCommand command)
        {
            /*if (command == null)
            {
                return BadRequest();
            }

            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result }, result);
        */

            var appointmentId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = appointmentId }, new { id = appointmentId });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateAppointmentCommand command)
        {
            if (id != command.AppointmentId)
            {
                throw new IdMismatchException();
            }

            var record = await _mediator.Send(new GetAppointmentByIdQuery { Id = id });
            if (record == null)
            {
                throw new AppointmentNotFound();
            }

            var result = await _mediator.Send(command);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {

            var patient = await _mediator.Send(new GetAppointmentByIdQuery { Id = id });
            if (patient == null)
            {
                throw new AppointmentNotFound();
            }
            await _mediator.Send(new DeleteAppointmentCommand { Id = id });
            return NoContent();
        }

        [Authorize]
        [HttpGet("protected")]
        public IActionResult GetProtectedData()
        {
          return Ok("This is a protected endpoint");
        }
  }
}
