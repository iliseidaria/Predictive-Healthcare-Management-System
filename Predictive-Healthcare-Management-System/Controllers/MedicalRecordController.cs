using Application.DTOs;
using Application.Use_Cases.Commands;
using Application.Use_Cases.Queries;
using MediatR;
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
        public async Task<ActionResult<MedicalRecordDTO>> GetById(Guid id)
        {
            var record = await _mediator.Send(new GetMedicalRecordByIdQuery { Id = id });
            if (record == null)
            {
                return NotFound();
            }
            return Ok(record);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _mediator.Send(new GetMedicalRecordsQuery());
            return Ok(result);
        }

        //[HttpDelete("{id}")]
        //public async Task<IActionResult> Delete(Guid id)
        //{
        //    var patient = await _mediator.Send(new GetPatientByIdQuery { Id = id });
        //    if (patient == null)
        //    {
        //        throw new NotFoundException();
        //    }
        //    await _mediator.Send(new DeletePatientCommand { Id = id });
        //    return NoContent();
        //}

        //[HttpPut("{id}")]
        //public async Task<IActionResult> Update(Guid id, UpdatePatientCommand command)
        //{
        //    if (id != command.PatientId)
        //    {
        //        throw new IdMismatchException();
        //    }

        //    var patient = await _mediator.Send(new GetPatientByIdQuery { Id = id });
        //    if (patient == null)
        //    {
        //        throw new NotFoundException();
        //    }

        //    await _mediator.Send(command);
        //    return NoContent();
        //}
    }
}
