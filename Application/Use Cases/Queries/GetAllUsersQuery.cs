using MediatR;

namespace Application.Queries
{
    public class GetAllUsersQuery : IRequest<GetAllUsersResponse>
    {
        public int Page { get; set; }
        public int Size { get; set; }

        public GetAllUsersQuery(int page, int size)
        {
            Page = page;
            Size = size;
        }
    }
}
