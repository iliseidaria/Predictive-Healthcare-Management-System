using Application.DTOs;
using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetPatientsQuery : IRequest<List<PatientDTO>>
    {
        public Guid PatientId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string ContactInformation { get; set; }
        public string Address { get; set; }
        public string PhotoPath { get; set; }
    }
}
