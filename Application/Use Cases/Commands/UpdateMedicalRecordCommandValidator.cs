using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Use_Cases.Commands
{
    public class UpdateMedicalRecordCommandValidator : AbstractValidator<UpdateMedicalRecordCommand>
    {
        private readonly IPatientRepository _patientRepository;
        private bool PatientExists(Guid patientId)
        {
            return _patientRepository.PatientExistsAsync(patientId).GetAwaiter().GetResult();
        }
        public UpdateMedicalRecordCommandValidator(IPatientRepository patientRepository) {
            _patientRepository = patientRepository;

            RuleFor(x => x.RecordId)
                .NotEmpty()
                .WithMessage("Medical Record ID must not be empty.");
            RuleFor(x => x.PatientId)
                .NotEmpty()
                .WithMessage("Patient ID must not be empty.")
                .Must(PatientExists)
                .WithMessage("Patient ID does not exist.");
            RuleFor(p => p.Date)
                .NotEmpty()
                .WithMessage("Date is required.")
                .LessThanOrEqualTo(DateTime.Now)
                .WithMessage("Date must be in the past or present.");
            RuleFor(x => x.Diagnosis)
               .NotEmpty()
               .WithMessage("Diagnosis is required.")
               .MaximumLength(500);
            RuleFor(x => x.Notes)
                .MaximumLength(1000);
        }
    }
}
