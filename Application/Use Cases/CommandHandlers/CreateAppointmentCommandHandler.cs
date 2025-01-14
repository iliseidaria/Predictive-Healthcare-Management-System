using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Entities;
using Infrastructure.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class CreateAppointmentCommandHandler : IRequestHandler<CreateAppointmentCommand, Guid>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IUserRepository _patientRepository;
        private readonly IMapper _mapper;

        public CreateAppointmentCommandHandler(IAppointmentRepository appointmentRepository, IUserRepository patientRepository, IMapper mapper)
        {
            _appointmentRepository = appointmentRepository;
            _patientRepository = patientRepository;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(CreateAppointmentCommand request, CancellationToken cancellationToken)
        {
            var patient = await _patientRepository.GetUserByIdAsync(request.PatientId);
            if (patient == null)
            {
                throw new Exception("Patient not found");
            }

            if (request.Status == 0) // If no status is sent, use default
            {
              request.Status = AppointmentStatus.Scheduled;
            }

            var appointment = _mapper.Map<Appointment>(request);

            if (appointment.Status == 0)
            {
              appointment.Status = AppointmentStatus.Scheduled;
            }

            return await _appointmentRepository.AddAppointmentAsync(appointment);
        }
    }
}
