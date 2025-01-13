// Domain/Interfaces/IMedicalRecordRepository.cs
using Domain.Entities;

public interface IMedicalRecordRepository
{
    Task<List<MedicalRecord>> GetMedicalRecordsAsync();
    Task<List<MedicalRecord>> GetAllByPatientIdAsync(Guid patientId, int page, int size);
    Task<MedicalRecord> GetMedicalRecordByIdAsync(Guid recordId);
    Task<Guid> AddMedicalRecordAsync(MedicalRecord medicalRecord);
    Task<bool> UpdateAsync(MedicalRecord medicalRecord);
    Task<bool> DeleteMedicalRecordAsync(Guid recordId);
    void Detach(MedicalRecord existingRecord);
}
