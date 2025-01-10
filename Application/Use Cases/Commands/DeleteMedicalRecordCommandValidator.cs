using FluentValidation;

namespace Application.Use_Cases.Commands
{
    public class DeleteMedicalRecordCommandValidator : AbstractValidator<DeleteMedicalRecordCommand>
    {
        public DeleteMedicalRecordCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Medical Record ID must not be empty.");
        }
    }
}
