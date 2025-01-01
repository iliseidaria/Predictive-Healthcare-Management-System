using MediatR;

namespace Application.Queries
{
    public class GetUserAppointmentsQuery : IRequest<GetUserAppointmentsResponse>
    {
        public Guid UserId { get; set; }
        public int Page { get; set; }
        public int Size { get; set; }

        public GetUserAppointmentsQuery(Guid userId, int page, int size)
        {
            UserId = userId;
            Page = page;
            Size = size;
        }
    }
}

