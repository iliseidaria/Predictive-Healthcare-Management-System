using Application.DTOs;
using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetPatientsQuery : IRequest<List<PatientDTO>>
    {
        public int Page { get; set; } = 1;  // Pagina implicită
        public int Size { get; set; } = 10; // Mărimea implicită
    }
}
