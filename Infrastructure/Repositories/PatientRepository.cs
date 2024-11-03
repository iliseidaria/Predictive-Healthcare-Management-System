using Domain.Repositories;
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

        public async Task DeletePatientAsync(Guid id)
        {
            var product = context.Patients.FirstOrDefault(x => x.PatientId == id);
            if (product != null)
            {
                context.Patients.Remove(product);
                await context.SaveChangesAsync();
            }
        }

        public async Task<Patient> GetPatientByIdAsync(Guid id)
        {

            return await context.Patients.FindAsync(id); 
        }

        public async Task<IEnumerable<Patient>> GetPatientsAsync()
        {
            return await context.Patients.ToListAsync();
        }

        public async Task UpdatePatientAsync(Patient patient)
        {
            context.Entry(patient).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }
    }
}