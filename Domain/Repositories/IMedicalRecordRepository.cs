// Domain/Interfaces/IMedicalRecordRepository.cs
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IMedicalRecordRepository
{
    Task<List<MedicalRecord>> GetAllByPatientIdAsync(Guid patientId);
    Task<MedicalRecord> GetByIdAsync(Guid recordId);
    Task<bool> AddAsync(MedicalRecord medicalRecord);
    Task<bool> UpdateAsync(MedicalRecord medicalRecord);
    Task<bool> DeleteAsync(Guid recordId);
}