// Domain/Interfaces/IPredictionRepository.cs
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IPredictionRepository
{
    Task<List<Prediction>> GetAllByPatientIdAsync(Guid patientId);
    Task<Prediction> GetByIdAsync(Guid predictionId);
    Task<bool> AddAsync(Prediction prediction);
    Task<bool> UpdateAsync(Prediction prediction);
    Task<bool> DeleteAsync(Guid predictionId);
}