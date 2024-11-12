using Domain.Entities;

namespace Infrastructure.Repositories
{
    public interface IAppointmentRepository
    {
        Task<Appointment> GetAppointmentByIdAsync(Guid appointmentId);
        Task<List<Appointment>> GetAllAppointmentsAsync();
        Task<Guid> AddAppointmentAsync(Appointment appointment);
        Task<bool> UpdateAppointmentAsync(Appointment appointment);
        Task<bool> DeleteAppointmentAsync(Guid appointmentId);
    }
}
