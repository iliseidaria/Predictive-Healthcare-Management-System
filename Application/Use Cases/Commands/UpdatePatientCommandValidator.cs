using FluentValidation;

namespace Application.Use_Cases.Commands
{
    public class UpdatePatientCommandValidator : AbstractValidator<UpdatePatientCommand>
    {
        public UpdatePatientCommandValidator()
        {
            RuleFor(p => p.PatientId)
                .NotEmpty()
                .Must(BeAValidGuid)
                .WithMessage("PatienId must be a valid Guid.");

            RuleFor(p => p.FirstName)
                .NotEmpty()
                .WithMessage("First name is required.")
                .MaximumLength(100);

            RuleFor(p => p.LastName)
                .NotEmpty()
                .WithMessage("Last name is required.")
                .MaximumLength(100);

            RuleFor(p => p.DateOfBirth)
                .NotEmpty()
                .LessThan(DateTime.Now)
                .WithMessage("Date of birth must be in the past.");

            RuleFor(p => p.Gender)
                .NotNull()
                .WithMessage("Gender is required.");

            RuleFor(p => p.ContactInformation)
                .NotEmpty()
                .WithMessage("Contact information is required.")
                .MaximumLength(200);

            RuleFor(p => p.Address)
                .NotEmpty()
                .WithMessage("Address is required.")
                .MaximumLength(300);
        }

        private bool BeAValidGuid(Guid guid)
        {
            return Guid.TryParse(guid.ToString(), out _);
        }
    }
}
