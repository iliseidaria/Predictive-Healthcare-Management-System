using FluentValidation;

namespace Application.Use_Cases.Commands
{
    public class DeleteAppointmentCommandValidator : AbstractValidator<DeleteAppointmentCommand>
    {
        public DeleteAppointmentCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Appointment ID must not be empty.");
        }
    }
}
