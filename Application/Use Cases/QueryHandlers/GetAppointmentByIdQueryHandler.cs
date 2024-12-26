using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Infrastructure.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetAppointmentByIdQueryHandler : IRequestHandler<GetAppointmentByIdQuery, AppointmentDto>
    {
        public readonly IAppointmentRepository repository;
        public readonly IMapper mapper;

        public GetAppointmentByIdQueryHandler(IAppointmentRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        /*public async Task<AppointmentDTO> Handle(GetAppointmentByIdQuery request, CancellationToken cancellationToken)
        {
            var appointment = await repository.GetAppointmentByIdAsync(request.Id);
            return mapper.Map<AppointmentDTO>(appointment);
        }*/
        public async Task<AppointmentDto> Handle(GetAppointmentByIdQuery query, CancellationToken cancellationToken)
        {
            var appointment = await this.repository.GetAppointmentByIdAsync(query.Id);

            if (appointment == null)
            {
                return null; // Return null without calling Map
            }

            return mapper.Map<AppointmentDto>(appointment);
        }

    }
}
