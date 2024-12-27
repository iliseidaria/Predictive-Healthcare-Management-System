namespace Domain.Entities
{
    public enum AppointmentStatus
    {
        Scheduled,
        Completed,
        Canceled
    }
    public class Appointment
    {
        public Guid AppointmentId { get; set; }
        public Guid PatientId { get; set; }
        public Guid ProviderId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Reason { get; set; }
        public AppointmentStatus Status { get; set; }
    }
}
