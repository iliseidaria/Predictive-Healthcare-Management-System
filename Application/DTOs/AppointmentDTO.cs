using Domain.Entities;

namespace Application.DTOs
{
    public class AppointmentDto
    {
        public Guid AppointmentId { get; set; }
        public Guid PatientId { get; set; }
        public Guid ProviderId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public required string Reason { get; set; }
        public AppointmentStatus Status { get; set; }
    }
}
