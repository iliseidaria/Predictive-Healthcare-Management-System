using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
  public class PrescriptionRepository : IPrescriptionRepository
  {
    private readonly ApplicationDbContext context;

    public PrescriptionRepository(ApplicationDbContext context)
    {
      this.context = context;
    }

    public async Task<List<Prescription>> GetAllPrescriptionsAsync(int page, int size)
    {
      return await context.Prescriptions
          .Skip((page - 1) * size)
          .Take(size)
          .Select(p => new Prescription
          {
            PrescriptionId = p.PrescriptionId,
            PatientId = p.PatientId,
            MedicationName = p.MedicationName,
            Dosage = p.Dosage,
            Frequency = p.Frequency,
            StartDate = p.StartDate,
            EndDate = p.EndDate,
            Notes = p.Notes
          })
          .ToListAsync();
    }

    public async Task<int> GetTotalCountAsync()
    {
      return await context.Prescriptions.CountAsync();
    }

    public async Task<Prescription> GetPrescriptionByIdAsync(Guid prescriptionId)
    {
      var prescription = await context.Prescriptions.FindAsync(prescriptionId);
      if (prescription == null)
      {
        return null;
      }

      return new Prescription
      {
        PrescriptionId = prescription.PrescriptionId,
        PatientId = prescription.PatientId,
        MedicationName = prescription.MedicationName,
        Dosage = prescription.Dosage,
        Frequency = prescription.Frequency,
        StartDate = prescription.StartDate,
        EndDate = prescription.EndDate,
        Notes = prescription.Notes
      };
    }

    public async Task<bool> UpdateAsync(Prescription prescriptionDto)
    {
      var prescription = await context.Prescriptions.FindAsync(prescriptionDto.PrescriptionId);
      if (prescription == null)
      {
        return false;
      }

      prescription.PatientId = prescriptionDto.PatientId;
      prescription.MedicationName = prescriptionDto.MedicationName;
      prescription.Dosage = prescriptionDto.Dosage;
      prescription.Frequency = prescriptionDto.Frequency;
      prescription.StartDate = prescriptionDto.StartDate;
      prescription.EndDate = prescriptionDto.EndDate;
      prescription.Notes = prescriptionDto.Notes;

      context.Entry(prescription).State = EntityState.Modified;
      return (await context.SaveChangesAsync() > 0);
    }

    public async Task<Guid> DeletePrescriptionAsync(Guid prescriptionId)
    {
      var prescription = await context.Prescriptions.FindAsync(prescriptionId);
      if (prescription == null)
      {
        return Guid.Empty;
      }
      context.Prescriptions.Remove(prescription);
      await context.SaveChangesAsync();
      return prescriptionId;
    }

    public async Task<Guid> AddPrescriptionAsync(Prescription prescriptionDto)
    {
      var prescription = new Prescription
      {
        PrescriptionId = Guid.NewGuid(),
        PatientId = prescriptionDto.PatientId,
        MedicationName = prescriptionDto.MedicationName,
        Dosage = prescriptionDto.Dosage,
        Frequency = prescriptionDto.Frequency,
        StartDate = prescriptionDto.StartDate,
        EndDate = prescriptionDto.EndDate,
        Notes = prescriptionDto.Notes
      };

      await context.Prescriptions.AddAsync(prescription);
      await context.SaveChangesAsync();
      return prescription.PrescriptionId;
    }

    public void Detach(Prescription prescription)
    {
      context.Entry(prescription).State = EntityState.Detached;
    }
        public async Task<List<Prescription>> GetAllPrescriptionsAsync()
        {
            return await context.Prescriptions.ToListAsync();
        }
  }
}
