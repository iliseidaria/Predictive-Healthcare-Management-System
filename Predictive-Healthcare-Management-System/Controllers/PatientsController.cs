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
            var result = await _mediator.Send(new GetAllPatientsQuery());
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePatientCommand command)
        {
            var result = await _mediator.Send(command);
            if (result.IsSuccess)
                return CreatedAtAction(nameof(GetAll), new { id = result.Value.PatientId }, result.Value);

            return BadRequest(result.Errors);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePatientCommand command)
        {
            if (id != command.PatientId)
                return BadRequest("Id in URL and command must match");

            var result = await _mediator.Send(command);
            return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Errors);
        }
        //private readonly IMediator mediator;
        //public PatientsController(IMediator mediator)
        //{
        //    this.mediator = mediator;
        //}

        //[HttpGet]
        //public async Task<ActionResult<List<PatientDTO>>> GetProducts()
        //{
        //    return await mediator.Send(new GetProductsQuery());
        //}

        //[HttpPost]
        //public async Task<ActionResult<Guid>> CreateBook(CreateProductCommand command)
        //{
        //    var id = await mediator.Send(command);
        //    return CreatedAtAction("GetById", new { Id = id }, id);
        //}

        //[HttpGet("id")]
        //public async Task<ActionResult<ProductDTO>> GetById(Guid id)
        //{
        //    return await mediator.Send(new GetProductByIdQuery { Id = id });
        //}

        //[HttpDelete("id")]
        //public async Task<IActionResult> Delete(Guid id)
        //{
        //    await mediator.Send(new DeleteProductCommand { Id = id });
        //    return StatusCode(StatusCodes.Status204NoContent);
        //}

        //[HttpPut("id")]
        //public async Task<IActionResult> Update(Guid id, UpdateProductCommand command)
        //{
        //    if (id != command.Id)
        //    {
        //        return BadRequest();
        //    }
        //    await mediator.Send(command);
        //    return StatusCode(StatusCodes.Status204NoContent);
        //}
    }
}
