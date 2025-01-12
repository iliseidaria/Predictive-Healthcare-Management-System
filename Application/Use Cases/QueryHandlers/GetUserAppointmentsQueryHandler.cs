using Application.Queries;
using Application.DTOs;
using Infrastructure.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Handlers
{
  public class GetUserAppointmentsQueryHandler : IRequestHandler<GetUserAppointmentsQuery, GetUserAppointmentsResponse>
  {
    private readonly ApplicationDbContext _context;

    public GetUserAppointmentsQueryHandler(ApplicationDbContext context)
    {
      _context = context;
    }

    public async Task<GetUserAppointmentsResponse> Handle(GetUserAppointmentsQuery request, CancellationToken cancellationToken)
    {
      var totalAppointments = await _context.Appointments
          .Where(a => a.PatientID == request.UserId)
          .CountAsync(cancellationToken);

      var appointments = await _context.Appointments
          .Where(a => a.PatientID == request.UserId)
          .Skip((request.Page - 1) * request.Size)
          .Take(request.Size)
          .Select(a => new AppointmentDto
          {
            AppointmentId = a.AppointmentId,
            PatientId = a.PatientID,
            ProviderId = a.ProviderId,
            AppointmentDate = a.AppointmentDate,
            Reason = a.Reason,
            Status = a.Status
          })
          .ToListAsync(cancellationToken);

      return new GetUserAppointmentsResponse(totalAppointments, appointments);
    }
  }
}
