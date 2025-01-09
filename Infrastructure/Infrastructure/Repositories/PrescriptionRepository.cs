using Domain.Entities;
using Infrastructure.Persistence;
using System.Diagnostics.Metrics;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure.Repositories
{
  public class PrescriptionRepository :IPrescriptionRepository
  {
    private readonly ApplicationDbContext context;

    public PrescriptionRepository(ApplicationDbContext context)
    {
      this.context = context;
    }

    public async Task<List<Prescription>> GetAllPrescriptionsAsync()
    {
      return await context.Prescriptions.ToListAsync();
    }
    public async Task<Prescription> GetPrescriptionByIdAsync(Guid prescriptionId)
    {
      return await context.Prescriptions.FindAsync(prescriptionId);
    }
    public async Task<bool> UpdateAsync(Prescription prescription)
    {
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
    public async Task<Guid> AddPrescriptionAsync(Prescription prescription)
    {
      await context.Prescriptions.AddAsync(prescription);
      await context.SaveChangesAsync();
      return prescription.PrescriptionId;
    }

    public void Detach(Prescription prescription)
    {
      context.Entry(prescription).State = EntityState.Detached;
    }
  }
}
