using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Infrastructure.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetAppointmentQueryHandler : IRequestHandler<GetAppointmentQuery, List<AppointmentDto>>
    {
        private readonly IAppointmentRepository repository;
        private readonly IMapper mapper;

        public GetAppointmentQueryHandler(IAppointmentRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<List<AppointmentDto>> Handle(GetAppointmentQuery request, CancellationToken cancellationToken)
        {
            var appointments = await repository.GetAllAppointmentsAsync();
            return mapper.Map<List<AppointmentDto>>(appointments);
        }
    }
}
