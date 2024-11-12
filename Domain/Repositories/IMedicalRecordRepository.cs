// Domain/Interfaces/IMedicalRecordRepository.cs
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IMedicalRecordRepository
{
    Task<List<MedicalRecord>> GetMedicalRecordsAsync();
    Task<List<MedicalRecord>> GetAllByPatientIdAsync(Guid patientId);
    Task<MedicalRecord> GetMedicalRecordByIdAsync(Guid recordId);
    Task<Guid> AddMedicalRecordAsync(MedicalRecord medicalRecord);
    Task<bool> UpdateAsync(MedicalRecord medicalRecord);
    Task<bool> DeleteMedicalRecordAsync(Guid recordId);
    void Detach(MedicalRecord existingRecord);
}