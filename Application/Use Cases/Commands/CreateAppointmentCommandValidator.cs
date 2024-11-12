using Application.Use_Cases.Commands;
using FluentValidation;

namespace Application.Use_Cases.Commands
{
    public class CreateAppointmentCommandValidator : AbstractValidator<CreateAppointmentCommand>
    {
        public CreateAppointmentCommandValidator()
        {
            RuleFor(p => p.PatientId)
                .NotEmpty()
                .WithMessage("Patient Id is required." );
            RuleFor(p => p.ProviderId)
                .NotEmpty()
                .WithMessage("Provider Id is required.");
            RuleFor(p => p.AppointmentDate)
                .NotEmpty()
                .GreaterThan(DateTime.Now)
                .WithMessage("Date of appointment must be in the past.");
            RuleFor(p => p.Reason)
                .NotEmpty()
                .WithMessage("Reason is required.")
                .MaximumLength(500);
            RuleFor(p => p.Status)
                .NotNull()
                .WithMessage("Status is required.");
        }
    }
}