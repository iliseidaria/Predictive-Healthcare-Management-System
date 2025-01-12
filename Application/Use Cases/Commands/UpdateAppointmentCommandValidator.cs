using FluentValidation;
using System;

namespace Application.Use_Cases.Commands
{
    public class UpdateAppointmentCommandValidator : AbstractValidator<UpdateAppointmentCommand>
    {
        private readonly IUserRepository _patientRepository;

        // Checks if the patient exists in the database
        private bool PatientExists(Guid patientId)
        {
            return _patientRepository.UserExistsAsync(patientId).GetAwaiter().GetResult();
        }

        public UpdateAppointmentCommandValidator(IUserRepository patientRepository)
        {
            _patientRepository = patientRepository;

            RuleFor(x => x.AppointmentId)
                .NotEmpty()
                .WithMessage("Appointment ID must not be empty.");

            RuleFor(x => x.PatientId)
                .NotEmpty()
                .WithMessage("Patient ID must not be empty.")
                .Must(PatientExists)
                .WithMessage("Patient ID does not exist.");

            RuleFor(x => x.ProviderId)
                .NotEmpty()
                .WithMessage("Provider ID must not be empty.");

            RuleFor(x => x.AppointmentDate)
                .NotEmpty()
                .WithMessage("Appointment date is required.")
                .GreaterThanOrEqualTo(DateTime.Now)
                .WithMessage("Appointment date must be in the future.");

            RuleFor(x => x.Reason)
                .NotEmpty()
                .WithMessage("Reason for the appointment is required.")
                .MaximumLength(500)
                .WithMessage("Reason cannot exceed 500 characters.");

            RuleFor(x => x.Status)
                .InclusiveBetween(0, 1)
                .WithMessage("Status must be either 0 (scheduled) or 1 (completed).");
        }
    }
}
