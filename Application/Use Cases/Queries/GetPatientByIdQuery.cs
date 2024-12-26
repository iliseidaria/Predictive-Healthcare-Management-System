using Application.DTOs;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetPatientByIdQuery : IRequest<PatientDto>
    {
        public Guid Id { get; set; }
    }
}
