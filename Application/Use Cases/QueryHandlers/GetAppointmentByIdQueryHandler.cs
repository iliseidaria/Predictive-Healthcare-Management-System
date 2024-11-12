using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Infrastructure.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetAppointmentByIdQueryHandler : IRequestHandler<GetAppointmentByIdQuery, AppointmentDTO>
    {
        public readonly IAppointmentRepository repository;
        public readonly IMapper mapper;

        public GetAppointmentByIdQueryHandler(IAppointmentRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<AppointmentDTO> Handle(GetAppointmentByIdQuery request, CancellationToken cancellationToken)
        {
            var appointment = await repository.GetAppointmentByIdAsync(request.Id);
            return mapper.Map<AppointmentDTO>(appointment);
        }
    }
}