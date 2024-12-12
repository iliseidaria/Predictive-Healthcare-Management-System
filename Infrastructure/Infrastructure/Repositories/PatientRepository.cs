using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class PatientRepository : IPatientRepository
    {
        private readonly ApplicationDbContext context;

        public PatientRepository(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<Guid> AddPatientAsync(Patient patient)
        {
            await context.Patients.AddAsync(patient);
            await context.SaveChangesAsync();
            return patient.PatientId;
        }

        public async Task<Guid> DeletePatientAsync(Guid id)
        {
            var patient = await context.Patients.FirstOrDefaultAsync(x => x.PatientId == id);
            if (patient != null)
            {
                context.Patients.Remove(patient);
                await context.SaveChangesAsync();
                return id;
            }
            return Guid.Empty;
        }

        public async Task<Patient> GetPatientByIdAsync(Guid id)
        {
            return await context.Patients.FindAsync(id);
        }

        public async Task<IEnumerable<Patient>> GetPatientsAsync()
        {
            return await context.Patients.ToListAsync();
        }

        public async Task<List<Patient>> GetAllPatientsAsync()
        {
            return await context.Patients.ToListAsync();
        }

        public async Task<bool> UpdateAsync(Patient patient)
        {
            context.Entry(patient).State = EntityState.Modified;
            return await context.SaveChangesAsync() > 0;
        }
        public void Detach(Patient patient)
        {
            context.Entry(patient).State = EntityState.Detached;
        }
        public async Task<bool> PatientExistsAsync(Guid patientId)
        {
            return await context.Patients.AnyAsync(p => p.PatientId == patientId);
        }
    }
}
