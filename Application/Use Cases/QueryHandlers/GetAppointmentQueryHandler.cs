using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Infrastructure.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    internal class GetAppointmentQueryHandler : IRequestHandler<GetAppointmentQuery, List<AppointmentDTO>>
    {
        private readonly IAppointmentRepository repository;
        private readonly IMapper mapper;

        public GetAppointmentQueryHandler(IAppointmentRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<List<AppointmentDTO>> Handle(GetAppointmentQuery request, CancellationToken cancellationToken)
        {
            var appointments = await repository.GetAllAppointmentsAsync();
            return mapper.Map<List<AppointmentDTO>>(appointments);
        }
    }
}