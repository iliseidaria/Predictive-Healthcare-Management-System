using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

public class IdMismatchException : Exception { }
public class NotFoundException : Exception { }
public class MedicalRecordNotFoundException : Exception { }
public class AppointmentNotFound : Exception { }

public class UserNotFound : Exception { }

namespace Predictive_Healthcare_Management_System.Controllers
{
    [ApiController]
    public class ErrorController : ControllerBase
    {

        [HttpGet] 
        [Route("/error-development")]
        public IActionResult HandleErrorDevelopment([FromServices] IHostEnvironment hostEnvironment)
        {
            if (!hostEnvironment.IsDevelopment())
            {
                return NotFound();
            }

            var exceptionHandlerFeature = HttpContext.Features.Get<IExceptionHandlerFeature>();
            var exception = exceptionHandlerFeature?.Error;

            if (exception != null)
            {
                return Problem(
                    detail: exception.StackTrace,
                    title: GetErrorMessage(exception));
            }

            return Problem("An error occurred, but no details are available.");
        }

        [HttpGet] 
        [Route("/error")]
        public IActionResult HandleError()
        {
            var exceptionHandlerFeature = HttpContext.Features.Get<IExceptionHandlerFeature>();
            var exception = exceptionHandlerFeature?.Error;

            return Problem(title: GetErrorMessage(exception));
        }

        private string GetErrorMessage(Exception exception)
        {
            return exception switch
            {
                AppointmentNotFound =>"The appointment mentioned is not found",
                IdMismatchException => "The ID in the URL does not match the ID in the command.",
                NotFoundException => "The requested patient was not found.",
                MedicalRecordNotFoundException => "The requested medical record was not found.",
                UserNotFound => "There is no user with this Id.",
                _ => "An unexpected error occurred."
            };
        }
    }
}
