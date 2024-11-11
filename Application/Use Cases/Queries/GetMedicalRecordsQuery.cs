using Application.DTOs;
using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetMedicalRecordsQuery : IRequest<List<MedicalRecordDTO>>
    {
        public Guid RecordId { get; set; }
        public Guid PatientId { get; set; }
        public DateTime Date { get; set; }
        public string Diagnosis { get; set; }
        public List<Prescription> Prescriptions { get; set; } = new List<Prescription>();
        public string Notes { get; set; }
    }
}
