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
        private readonly IPatientRepository _patientRepository;
        private readonly IMapper _mapper;

        public CreateAppointmentCommandHandler(IAppointmentRepository appointmentRepository, IPatientRepository patientRepository, IMapper mapper)
        {
            _appointmentRepository = appointmentRepository;
            _patientRepository = patientRepository;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(CreateAppointmentCommand request, CancellationToken cancellationToken)
        {
            var patient = await _patientRepository.GetPatientByIdAsync(request.PatientId);
            if (patient == null)
            {
                throw new Exception("Patient not found");
            }

            var appointment = _mapper.Map<Appointment>(request);
            return await _appointmentRepository.AddAppointmentAsync(appointment);
        }
    }
}
