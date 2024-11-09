using FluentValidation;
using Application.Use_Cases.Commands;

public class DeletePatientCommandValidator : AbstractValidator<DeletePatientCommand>
{
    public DeletePatientCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Patient ID must not be empty.");
    }
}