using Application.Use_Cases.Commands;
using Application.Use_Cases.CommandHandlers;
using AutoMapper;
using Domain.Entities;
using FluentAssertions;
using NSubstitute;
using Infrastructure.Repositories;

namespace PredictiveHealthcare.Application.UnitTests
{
    public class CreateAppointmentCommandHandlerTests
    {
        private readonly IAppointmentRepository appointmentRepository;
        private readonly IPatientRepository patientRepository;
        private readonly IMapper mapper;
        private readonly CreateAppointmentCommandHandler handler;

        public CreateAppointmentCommandHandlerTests()
        {
            appointmentRepository = Substitute.For<IAppointmentRepository>();
            patientRepository = Substitute.For<IPatientRepository>();
            mapper = Substitute.For<IMapper>();
            handler = new CreateAppointmentCommandHandler(appointmentRepository, patientRepository, mapper);
        }

        [Fact]
        public async Task Given_ValidCreateAppointmentCommand_When_HandleIsCalled_Then_AppointmentShouldBeCreated()
        {
            // Arrange
            var patientId = Guid.NewGuid();
            var appointmentId = Guid.NewGuid();

            var command = new CreateAppointmentCommand
            {
                PatientId = patientId,
                ProviderId = Guid.NewGuid(),
                AppointmentDate = DateTime.UtcNow,
                Reason = "Checkup",
                Status = AppointmentStatus.Scheduled
            };

            var patient = new Patient { PatientId = patientId };
            var appointment = new Appointment
            {
                AppointmentId = appointmentId,
                PatientId = command.PatientId,
                ProviderId = command.ProviderId,
                AppointmentDate = command.AppointmentDate,
                Reason = command.Reason,
                Status = command.Status
            };

            patientRepository.GetPatientByIdAsync(patientId).Returns(patient);
            mapper.Map<Appointment>(command).Returns(appointment);
            appointmentRepository.AddAppointmentAsync(appointment).Returns(appointmentId);

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            await patientRepository.Received(1).GetPatientByIdAsync(patientId);
            mapper.Received(1).Map<Appointment>(command);
            await appointmentRepository.Received(1).AddAppointmentAsync(appointment);
            result.Should().Be(appointmentId);
        }

        [Fact]
        public async Task Given_NonExistingPatient_When_HandleIsCalled_Then_ExceptionShouldBeThrown()
        {
            // Arrange
            var patientId = Guid.NewGuid();

            var command = new CreateAppointmentCommand
            {
                PatientId = patientId,
                ProviderId = Guid.NewGuid(),
                AppointmentDate = DateTime.UtcNow,
                Reason = "Checkup",
                Status = AppointmentStatus.Scheduled
            };

            patientRepository.GetPatientByIdAsync(patientId).Returns((Patient)null);

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(async () => await handler.Handle(command, CancellationToken.None));

            await patientRepository.Received(1).GetPatientByIdAsync(patientId);
            mapper.DidNotReceive().Map<Appointment>(Arg.Any<CreateAppointmentCommand>());
            await appointmentRepository.DidNotReceive().AddAppointmentAsync(Arg.Any<Appointment>());
        }
    }
}