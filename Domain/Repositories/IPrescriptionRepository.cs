// Domain/Interfaces/IPrescriptionRepository.cs
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IPrescriptionRepository
{
    Task<List<Prescription>> GetAllPrescriptionsAsync();
    Task<Prescription> GetPrescriptionByIdAsync(Guid prescriptionId);
    Task<bool> UpdateAsync(Prescription prescription);
    Task<Guid> DeletePrescriptionAsync(Guid prescriptionId);
    Task<Guid> AddPrescriptionAsync(Prescription prescription);
    void Detach(Prescription existingPrescription);
}