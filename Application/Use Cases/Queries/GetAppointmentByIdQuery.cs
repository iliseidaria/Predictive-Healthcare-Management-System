using Application.DTOs;
using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetAppointmentByIdQuery : IRequest<AppointmentDTO>
    {
        public Guid Id { get; set; }
    }
}
