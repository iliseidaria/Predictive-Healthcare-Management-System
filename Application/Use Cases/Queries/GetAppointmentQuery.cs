using Application.DTOs;
using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetAppointmentQuery : IRequest<List<AppointmentDTO>>
    {
        public Guid AppointmentId { get; set; }
        public Guid PatientId { get; set; }
        public Guid ProviderId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Reason { get; set; }
        public AppointmentStatus Status { get; set; }
    }
}
