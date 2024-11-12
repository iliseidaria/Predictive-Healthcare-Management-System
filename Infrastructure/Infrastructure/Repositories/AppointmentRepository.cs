using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly ApplicationDbContext _context;

        public AppointmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Appointment> GetAppointmentByIdAsync(Guid appointmentId)
        {
            return await _context.Appointments.FindAsync(appointmentId);
        }

        public async Task<List<Appointment>> GetAllAppointmentsAsync()
        {
            return await _context.Appointments.ToListAsync();
        }

        public async Task<Guid> AddAppointmentAsync(Appointment appointment)
        {
            await _context.Appointments.AddAsync(appointment);
            await _context.SaveChangesAsync();
            return appointment.AppointmentId;
        }

        public async Task<bool> UpdateAppointmentAsync(Appointment appointment)
        {
            _context.Appointments.Update(appointment);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAppointmentAsync(Guid appointmentId)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId);
            if (appointment == null)
            {
                return false;
            }

            _context.Appointments.Remove(appointment);
            return await _context.SaveChangesAsync() > 0;
        }
        public void Detach(Appointment appointment)
        {
            _context.Entry(appointment).State = EntityState.Detached;  
        }
    }
}