using Application.DTOs;
using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetMedicalRecordByUserIdQuery : IRequest<List<MedicalRecord>>
    {
        public Guid Id { get; set; }

        public int Page { get; set; }
        public int Size { get; set; }
  }
}
