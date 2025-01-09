using Domain.Entities;

public interface IPrescriptionRepository
{
  Task<List<Prescription>> GetAllPrescriptionsAsync(int page, int size);
  Task<Prescription> GetPrescriptionByIdAsync(Guid prescriptionId);
  Task<bool> UpdateAsync(Prescription prescriptionDto);
  Task<Guid> DeletePrescriptionAsync(Guid prescriptionId);
  Task<Guid> AddPrescriptionAsync(Prescription prescriptionDto);
  void Detach(Prescription existingPrescription);
  Task<int> GetTotalCountAsync();
}
