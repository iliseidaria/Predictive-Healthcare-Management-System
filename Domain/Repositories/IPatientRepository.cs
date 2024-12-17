// Domain/Interfaces/IPatientRepository.cs
using Domain.Entities;

public interface IPatientRepository
{
    Task<List<Patient>> GetAllPatientsAsync(int page, int size);
    Task<Patient> GetPatientByIdAsync(Guid patientId);
    Task<bool> UpdateAsync(Patient patient);
    Task<Guid> DeletePatientAsync(Guid patientId);
    Task<Guid> AddPatientAsync(Patient product);
    void Detach(Patient existingPatient);
    Task<bool> PatientExistsAsync(Guid patientId);
    Task<int> GetTotalPatientsCountAsync();
}
