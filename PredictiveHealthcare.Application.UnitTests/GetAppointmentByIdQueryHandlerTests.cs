using Application.DTOs;
using Application.Use_Cases.Queries;
using Application.Use_Cases.QueryHandlers;
using AutoMapper;
using Domain.Entities;
using FluentAssertions;
using Infrastructure.Repositories;
using NSubstitute;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace PredictiveHealthcare.Application.UnitTests
{
    public class GetAppointmentByIdQueryHandlerTests
    {
        private readonly IAppointmentRepository repository;
        private readonly IMapper mapper;
        private readonly GetAppointmentByIdQueryHandler handler;

        public GetAppointmentByIdQueryHandlerTests()
        {
            repository = Substitute.For<IAppointmentRepository>();
            mapper = Substitute.For<IMapper>();
            handler = new GetAppointmentByIdQueryHandler(repository, mapper);
        }

        [Fact]
        public async Task Given_ExistingAppointment_When_HandleIsCalled_Then_AppointmentDTOShouldBeReturned()
        {
            // Arrange
            var appointmentId = Guid.NewGuid();
            var query = new GetAppointmentByIdQuery { Id = appointmentId };

            var appointment = new Appointment
            {
                AppointmentId = appointmentId,
                PatientId = Guid.NewGuid(),
                ProviderId = Guid.NewGuid(),
                AppointmentDate = DateTime.UtcNow,
                Reason = "Routine Checkup",
                Status = AppointmentStatus.Scheduled
            };

            var expectedDto = new AppointmentDto
            {
                AppointmentId = appointment.AppointmentId,
                PatientId = appointment.PatientId,
                ProviderId = appointment.ProviderId,
                AppointmentDate = appointment.AppointmentDate,
                Reason = appointment.Reason,
                Status = appointment.Status
            };

            repository.GetAppointmentByIdAsync(appointmentId).Returns(appointment);
            mapper.Map<AppointmentDto>(appointment).Returns(expectedDto);

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            await repository.Received(1).GetAppointmentByIdAsync(appointmentId);
            mapper.Received(1).Map<AppointmentDto>(appointment);
            result.Should().BeEquivalentTo(expectedDto);
        }

        [Fact]
        public async Task Given_NonExistingAppointment_When_HandleIsCalled_Then_NullShouldBeReturned()
        {
            // Arrange
            var appointmentId = Guid.NewGuid();
            var query = new GetAppointmentByIdQuery { Id = appointmentId };

            // Set up repository to return null, indicating the appointment does not exist
            repository.GetAppointmentByIdAsync(appointmentId).Returns(Task.FromResult<Appointment>(null!));

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            await repository.Received(1).GetAppointmentByIdAsync(appointmentId);
            mapper.DidNotReceive().Map<AppointmentDto>(Arg.Any<Appointment>());
            result.Should().BeNull();
        }
    }
}
