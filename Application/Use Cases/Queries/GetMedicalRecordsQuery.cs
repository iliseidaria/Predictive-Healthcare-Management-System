using Application.DTOs;
using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetMedicalRecordsQuery : IRequest<List<MedicalRecordDto>>
    {
        public Guid RecordId { get; set; }
        public Guid PatientId { get; set; }
        public DateTime Date { get; set; }
        public required string Diagnosis { get; set; }
        public List<Prescription> Prescriptions { get; set; } = new List<Prescription>();
        public string Notes { get; set; } = string.Empty;
  }
}
