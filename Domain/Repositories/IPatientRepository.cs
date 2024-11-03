// Domain/Interfaces/IPatientRepository.cs
using Domain.Entities;

public interface IPatientRepository
{
    Task<List<Patient>> GetAllPatientsAsync();
    Task<Patient> GetPatientByIdAsync(Guid patientId);
    Task<bool> AddAsync(Patient patient);
    Task<bool> UpdateAsync(Patient patient);
    Task<bool> DeleteAsync(Guid patientId);
}