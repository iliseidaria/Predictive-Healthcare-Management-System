using Application.DTOs;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetMedicalRecordByIdQuery : IRequest<MedicalRecordDTO>
    {
        public Guid Id { get; set; }
    }
}
