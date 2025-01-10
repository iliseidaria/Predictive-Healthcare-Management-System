using FluentValidation;
using System;

namespace Application.Use_Cases.Commands
{
  public class UpdatePrescriptionCommandValidator : AbstractValidator<UpdatePrescriptionCommand>
  {
    public UpdatePrescriptionCommandValidator()
    {
      RuleFor(x => x.PrescriptionId)
          .NotEmpty().WithMessage("PrescriptionId is required.");

      RuleFor(x => x.PatientId)
          .NotEmpty().WithMessage("PatientId is required.");

      RuleFor(x => x.MedicationName)
          .NotEmpty().WithMessage("MedicationName is required.")
          .MaximumLength(100).WithMessage("MedicationName must not exceed 100 characters.");

      RuleFor(x => x.Dosage)
          .NotEmpty().WithMessage("Dosage is required.")
          .MaximumLength(100).WithMessage("Dosage must not exceed 100 characters.");

      RuleFor(x => x.Frequency)
          .NotEmpty().WithMessage("Frequency is required.")
          .MaximumLength(100).WithMessage("Frequency must not exceed 100 characters.");

      RuleFor(x => x.StartDate)
          .NotEmpty().WithMessage("StartDate is required.")
          .Must(BeAValidDate).WithMessage("StartDate must be a valid date.");

      RuleFor(x => x.EndDate)
          .NotEmpty().WithMessage("EndDate is required.")
          .Must(BeAValidDate).WithMessage("EndDate must be a valid date.")
          .GreaterThanOrEqualTo(x => x.StartDate).WithMessage("EndDate must be after StartDate.");

      RuleFor(x => x.Notes)
          .MaximumLength(1000).WithMessage("Notes must not exceed 1000 characters.");
    }

    private bool BeAValidDate(DateTime date)
    {
      return !date.Equals(default(DateTime));
    }
  }
}

