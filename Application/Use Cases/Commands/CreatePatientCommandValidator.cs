using Application.Use_Cases.Commands;
using FluentValidation; 

namespace Application.Use_Cases.CommandHandlers
{
    public class CreatePatientCommandValidator : AbstractValidator<CreateUserCommand>
    {
        public CreatePatientCommandValidator()
        {
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
    }
}
