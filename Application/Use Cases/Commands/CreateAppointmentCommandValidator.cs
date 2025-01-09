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
                .WithMessage("Appointment date is required."); 
            RuleFor(a => a.Reason)
                .NotEmpty()
                .WithMessage("Reason is required.")
                .MaximumLength(1000)
                .WithMessage("Reason cannot exceed 1000 characters.");
            RuleFor(a => a.Status)
                .IsInEnum()
                .WithMessage("Invalid appointment status.");
    }
    }
}
