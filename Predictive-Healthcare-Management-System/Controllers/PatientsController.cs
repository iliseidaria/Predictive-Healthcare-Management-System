//using Application.DTOs;
//using Application.Use_Cases.Commands;
//using Application.Use_Cases.Queries;
//using MediatR;
//using Microsoft.AspNetCore.Components.Forms;
//using Microsoft.AspNetCore.Mvc;

//namespace Predictive_Healthcare_Management_System.Controllers
//{
//    [Route("api/v1/[controller]")]
//    [ApiController]
//    public class PatientsController : ControllerBase
//    {
//        private readonly IMediator _mediator;

//        public PatientsController(IMediator mediator)
//        {
//            _mediator = mediator;
//        }

//        [HttpGet]
//        public async Task<IActionResult> GetAll()
//        {
//            var result = await _mediator.Send(new GetPatientsQuery());
//            return Ok(result);
//        }

//        [HttpGet("{id}")]
//        public async Task<ActionResult<PatientDTO>> GetById(Guid id)
//        {
//            if (id == Guid.Empty)
//            {
//                return BadRequest("Invalid patient ID");
//            }

//            var result = await _mediator.Send(new GetPatientByIdQuery { Id = id });
//            return result != null ? Ok(result) : NotFound();
//        }

//        [HttpPost]
//        public async Task<IActionResult> Create(CreatePatientCommand command)
//        {
//            if (!ModelState.IsValid)
//            {
//                return BadRequest(ModelState);
//            }

//            try
//            {
//                var patientId = await _mediator.Send(command);
//                return CreatedAtAction(nameof(GetAll), new { id = patientId }, new { id = patientId });
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new { Error = ex.Message });
//            }
//        }

//        [HttpDelete("{id}")]
//        public async Task<IActionResult> Delete(Guid id)
//        {
//            if (id == Guid.Empty)
//            {
//                return BadRequest("Invalid patient ID");
//            }

//            var patient = await _mediator.Send(new GetPatientByIdQuery { Id = id });
//            if (patient == null)
//            {
//                return NotFound(new { Error = "Patient not found" });
//            }

//            await _mediator.Send(new DeletePatientCommand { Id = id });
//            return NoContent();



//        }

//        [HttpPut("{id}")]
//        public async Task<IActionResult> Update(Guid id, UpdatePatientCommand command)
//        {
//            if (id != command.PatientId)
//            {
//                return BadRequest("Id in URL and command must match");
//            }

//            if (!ModelState.IsValid)
//            {
//                return BadRequest(ModelState);
//            }

//            try
//            {
//                await _mediator.Send(command);
//                return NoContent();
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new { Error = ex.Message });
//            }
//        }
//    }
//}


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
                return NotFound(new { Error = "Patient not found" });
            }
            return Ok(patient);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreatePatientCommand command)
        {
            try
            {
                var patientId = await _mediator.Send(command);
                return CreatedAtAction(nameof(GetById), new { id = patientId }, new { id = patientId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var patient = await _mediator.Send(new GetPatientByIdQuery { Id = id });
            if (patient == null)
            {
                return NotFound(new { Error = "Patient not found" });
            }
            await _mediator.Send(new DeletePatientCommand { Id = id });
            return StatusCode(StatusCodes.Status204NoContent);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdatePatientCommand command)
        {
            if (id != command.PatientId)
                return BadRequest("Id in URL and command must match");

            var patient = await _mediator.Send(new GetPatientByIdQuery { Id = id });
            if (patient == null)
            {
                return NotFound(new { Error = "Patient not found" });
            }

            try
            {
                await _mediator.Send(command);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}
