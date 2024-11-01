// Domain/Interfaces/IPatientRepository.cs
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IPatientRepository
{
    Task<List<Patient>> GetAllAsync();
    Task<Patient> GetByIdAsync(Guid patientId);
    Task<bool> AddAsync(Patient patient);
    Task<bool> UpdateAsync(Patient patient);
    Task<bool> DeleteAsync(Guid patientId);
}