// Domain/Interfaces/IPredictionRepository.cs
using Domain.Entities;

public interface IPredictionRepository
{
    Task<List<Prediction>> GetAllByPatientIdAsync(Guid patientId);
    Task<Prediction> GetByIdAsync(Guid predictionId);
    Task<bool> AddAsync(Prediction prediction);
    Task<bool> UpdateAsync(Prediction prediction);
    Task<bool> DeleteAsync(Guid predictionId);
}
