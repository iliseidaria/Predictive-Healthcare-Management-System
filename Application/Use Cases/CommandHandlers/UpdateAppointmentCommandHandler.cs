using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Entities;
using Infrastructure.Repositories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Use_Cases.CommandHandlers
{
    public class UpdateAppointmentCommandHandler : IRequestHandler<UpdateAppointmentCommand, Unit>
    {
        private readonly IAppointmentRepository _repository;
        private readonly IMapper _mapper;

        public UpdateAppointmentCommandHandler(IAppointmentRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<Unit> Handle(UpdateAppointmentCommand request, CancellationToken cancellationToken)
        {
            // Retrieve the existing appointment
            var existingAppointment = await _repository.GetAppointmentByIdAsync(request.AppointmentId);
            if (existingAppointment == null)
            {
                throw new KeyNotFoundException("Appointment not found");
            }

            // Detach the existing appointment if needed (depends on your repository behavior)
            _repository.Detach(existingAppointment);

            // Map the updated command to the Appointment entity
            var updatedAppointment = _mapper.Map<Appointment>(request);

            // Update the appointment in the repository
            await _repository.UpdateAppointmentAsync(updatedAppointment);

            return Unit.Value;
        }
    }
}
