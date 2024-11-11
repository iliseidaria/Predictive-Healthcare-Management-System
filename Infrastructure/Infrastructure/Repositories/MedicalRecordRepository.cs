using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class MedicalRecordRepository : IMedicalRecordRepository
    {
        private readonly ApplicationDbContext context;

        public MedicalRecordRepository(ApplicationDbContext context)
        {
            this.context = context;
        }
        public async Task<Guid> AddMedicalRecordAsync(MedicalRecord medicalRecord)
        {
            await context.MedicalRecords.AddAsync(medicalRecord);
            await context.SaveChangesAsync();
            return medicalRecord.RecordId;
        }
        public async Task<List<MedicalRecord>> GetMedicalRecordsAsync()
        {
            return await context.MedicalRecords.ToListAsync();
        }

        public async Task<bool> DeleteAsync(Guid recordId)
        {
            var medicalRecord = await context.MedicalRecords.FindAsync(recordId);
            if (medicalRecord == null)
            {
                return false;
            }

            context.MedicalRecords.Remove(medicalRecord);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<List<MedicalRecord>> GetAllByPatientIdAsync(Guid patientId)
        {
            return await context.MedicalRecords.Where(mr => mr.PatientId == patientId).ToListAsync();
        }

        public async Task<MedicalRecord> GetMedicalRecordByIdAsync(Guid recordId)
        {
            return await context.MedicalRecords.FindAsync(recordId);
        }

        public async Task<bool> UpdateAsync(MedicalRecord medicalRecord)
        {
            context.MedicalRecords.Update(medicalRecord);
            await context.SaveChangesAsync();
            return true;
        }
    }
}
