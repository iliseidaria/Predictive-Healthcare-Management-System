using Application.DTOs;

namespace Application.Queries
{
    public class GetUserAppointmentsResponse
    {
        public int TotalAppointments { get; set; }
        public List<AppointmentDto> Appointments { get; set; }

        public GetUserAppointmentsResponse(int totalAppointments, List<AppointmentDto> appointments)
        {
            TotalAppointments = totalAppointments;
            Appointments = appointments;
        }
    }
}

