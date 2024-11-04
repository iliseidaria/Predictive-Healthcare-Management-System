using Application.Use_Cases.Commands;
using FluentValidation; 

namespace Application.Use_Cases.CommandHandlers
{
    public class CreatePatientCommandValidator : AbstractValidator<CreatePatientCommand>
    {
        public CreatePatientCommandValidator()
        {
            RuleFor(p => p.FirstName)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(p => p.LastName)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(p => p.DateOfBirth)
                .NotEmpty()
                .LessThan(DateTime.Now)
                .WithMessage("'{PropertyName}' must be in the past.");

            RuleFor(p => p.Gender)
                .NotNull()
                .WithMessage("'{PropertyName}' is required.");

            RuleFor(p => p.ContactInformation)
                .NotEmpty()
                .MaximumLength(200);

            RuleFor(p => p.Address)
                .NotEmpty()
                .MaximumLength(300);
        }

        private bool BeAValidGuid(Guid guid)
        {
            return Guid.TryParse(guid.ToString(), out _);
        }
    }
}
