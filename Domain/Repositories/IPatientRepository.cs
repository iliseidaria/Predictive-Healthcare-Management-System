// Domain/Interfaces/IPatientRepository.cs
using Domain.Entities;

public interface IPatientRepository
{
    Task<List<Patient>> GetAllPatientsAsync();
    Task<Patient> GetPatientByIdAsync(Guid patientId);
    Task<bool> UpdateAsync(Patient patient);
    Task<Guid> DeletePatientAsync(Guid patientId);
    Task<Guid> AddPatientAsync(Patient product);
}