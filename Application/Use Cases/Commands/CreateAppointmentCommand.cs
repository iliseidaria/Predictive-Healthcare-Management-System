using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class CreateAppointmentCommand : IRequest<Guid>
    {
        public Guid PatientId { get; set; }
        public Guid ProviderId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Reason { get; set; }
        public AppointmentStatus Status { get; set; }
    }
}
