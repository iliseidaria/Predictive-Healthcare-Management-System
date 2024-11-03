using Application.DTOs;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetPatientByIdQuery : IRequest<PatientDTO>
    {
        public Guid Id { get; set; }
    }
}
