using MediatR;

namespace Application.Use_Cases.Queries
{
  public class GetDoctorByIdQuery : IRequest<bool>
    {
        public required string DoctorId { get; set; }
    }
}
