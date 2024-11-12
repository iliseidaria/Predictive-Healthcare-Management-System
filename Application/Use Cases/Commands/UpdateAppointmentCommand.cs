using MediatR;
using System;

namespace Application.Use_Cases.Commands
{
    public class UpdateAppointmentCommand : IRequest<Unit>
    {
        public Guid AppointmentId { get; set; }     // Unique identifier for the appointment
        public Guid PatientId { get; set; }         // Identifier for the patient associated with this appointment
        public Guid ProviderId { get; set; }        // Identifier for the provider of this appointment
        public DateTime AppointmentDate { get; set; } // Date and time of the appointment
        public string Reason { get; set; }          // Reason for the appointment
        public int Status { get; set; }             // Status of the appointment (e.g., 0 for scheduled, 1 for completed, etc.)
    }
}
