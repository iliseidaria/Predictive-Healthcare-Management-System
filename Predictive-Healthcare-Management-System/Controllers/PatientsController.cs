using Application.DTOs;
using Application.Use_Cases.Commands;
using Application.Use_Cases.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Predictive_Healthcare_Management_System.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PatientsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _mediator.Send(new GetPatientsQuery());
            return Ok(result);
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
        public async Task<IActionResult> Create(CreatePatientCommand command)
        {
            var patientId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = patientId }, new { id = patientId });
        }

        [HttpDelete("{id}")]
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
        public async Task<IActionResult> Update(Guid id, UpdatePatientCommand command)
        {
            if (id != command.PatientId)
            {
                Console.WriteLine(id.ToString(), command.PatientId);
                throw new IdMismatchException(); 
            }

            var patient = await _mediator.Send(new GetPatientByIdQuery { Id = id });
            if (patient == null)
            {
                throw new NotFoundException(); 
            }

            await _mediator.Send(command);
            return NoContent();
        }
    }
}
