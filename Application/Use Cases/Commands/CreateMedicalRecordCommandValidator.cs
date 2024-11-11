using Domain.Entities;
using FluentValidation;

namespace Application.Use_Cases.Commands
{
    public class CreateMedicalRecordCommandValidator : AbstractValidator<CreateMedicalRecordCommand>
    {
        public CreateMedicalRecordCommandValidator()
        {
            RuleFor(x => x.PatientId)
                .NotEmpty()
                .WithMessage("Patient ID is required.");

            RuleFor(x => x.Date)
                .NotEmpty()
                .WithMessage("Date is required.")
                .LessThanOrEqualTo(DateTime.Now)
                .WithMessage("Date must be in the past or present.");

            RuleFor(x => x.Diagnosis)
                .NotEmpty()
                .WithMessage("Diagnosis is required.")
                .MaximumLength(500);

            //momentan sa mearga si fara:))
            //RuleFor(x => x.Prescriptions)
            //    .NotNull()
            //    .WithMessage("Prescriptions are required.");

            //RuleForEach(x => x.Prescriptions).SetValidator(new PrescriptionValidator());

            RuleFor(x => x.Notes)
                .MaximumLength(1000);
        }
    }
    //public class PrescriptionValidator : AbstractValidator<Prescription>
    //{
    //    public PrescriptionValidator()
    //    {
    //        RuleFor(x => x.PrescriptionId)
    //            .NotEmpty()
    //            .WithMessage("Prescription ID is required.");

    //        RuleFor(x => x.MedicationName)
    //            .NotEmpty()
    //            .WithMessage("Medication name is required.")
    //            .MaximumLength(200);

    //        RuleFor(x => x.Dosage)
    //            .NotEmpty()
    //            .WithMessage("Dosage is required.")
    //            .MaximumLength(100);

    //        RuleFor(x => x.Frequency)
    //            .NotEmpty()
    //            .WithMessage("Frequency is required.")
    //            .MaximumLength(100);

    //        RuleFor(x => x.StartDate)
    //            .NotEmpty()
    //            .WithMessage("Start date is required.");

    //        RuleFor(x => x.EndDate)
    //            .NotEmpty()
    //            .WithMessage("End date is required.")
    //            .GreaterThanOrEqualTo(x => x.StartDate)
    //            .WithMessage("End date must be after start date.");

    //        RuleFor(x => x.Notes)
    //            .MaximumLength(500);
    //    }
    //}
}