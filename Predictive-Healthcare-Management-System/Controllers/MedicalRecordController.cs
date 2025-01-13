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
    public class MedicalRecordController : ControllerBase
    {
        private readonly IMediator _mediator;

        public MedicalRecordController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateMedicalRecordCommand command)
        {
            var recordId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = recordId }, new { id = recordId });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MedicalRecordDto>> GetById(Guid id)
        {
            var record = await _mediator.Send(new GetMedicalRecordByIdQuery { Id = id });
            if (record == null)
            {
                return NotFound();
            }
            return Ok(record);
        }
        [HttpGet("user/{id}")]
        public async Task<ActionResult<MedicalRecordDto>> GetByUserId(Guid id, [FromQuery] int page = 1, [FromQuery] int size = 10)
        {
          var record = await _mediator.Send(new GetMedicalRecordByUserIdQuery { Id = id, Page=page, Size=size });
          if (record == null)
          {
            return NotFound();
          }
          return Ok(record);
        }

    [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _mediator.Send(new GetMedicalRecordsQuery()
            {
              Diagnosis = string.Empty // Set a default value for the required property
            });
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var patient = await _mediator.Send(new GetMedicalRecordByIdQuery { Id = id });
            if (patient == null)
            {
                throw new NotFoundException();
            }
            await _mediator.Send(new DeleteMedicalRecordCommand { Id = id });
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateMedicalRecordCommand command)
        {
            if (id != command.RecordId)
            {
                throw new IdMismatchException();
            }

            var record = await _mediator.Send(new GetMedicalRecordByIdQuery { Id = id });
            if (record == null)
            {
                throw new MedicalRecordNotFoundException();
            }

            await _mediator.Send(command);
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
