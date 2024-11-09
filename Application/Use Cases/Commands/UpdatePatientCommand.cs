using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class UpdatePatientCommand : IRequest<Unit>
    {
        public Guid PatientId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string ContactInformation { get; set; }
        public string Address { get; set; }
    }
}
