using Application.Use_Cases.Commands;
using Application.Use_Cases.CommandHandlers;
using Domain.Entities;
using FluentAssertions;
using MediatR;
using NSubstitute;
using Infrastructure.Repositories;

namespace PredictiveHealthcare.Application.UnitTests
{
    public class DeleteAppointmentCommandHandlerTests
    {
        private readonly IAppointmentRepository repository;
        private readonly DeleteAppointmentCommandHandler handler;

        public DeleteAppointmentCommandHandlerTests()
        {
            repository = Substitute.For<IAppointmentRepository>();
            handler = new DeleteAppointmentCommandHandler(repository);
        }

        [Fact]
        public async Task Given_ExistingAppointment_When_HandleIsCalled_Then_AppointmentShouldBeDeleted()
        {
            // Arrange
            var appointmentId = Guid.NewGuid();
            var command = new DeleteAppointmentCommand { Id = appointmentId };

            // Set up repository to return an existing appointment
            repository.GetAppointmentByIdAsync(appointmentId).Returns(new Appointment { AppointmentId = appointmentId });

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            await repository.Received(1).GetAppointmentByIdAsync(appointmentId);
            await repository.Received(1).DeleteAppointmentAsync(appointmentId);
            result.Should().Be(Unit.Value);
        }

        [Fact]
        public async Task Given_NonExistingAppointment_When_HandleIsCalled_Then_KeyNotFoundExceptionShouldBeThrown()
        {
            // Arrange
            var appointmentId = Guid.NewGuid();
            var command = new DeleteAppointmentCommand { Id = appointmentId };

            // Set up repository to return null, indicating the appointment does not exist
            repository.GetAppointmentByIdAsync(appointmentId).Returns((Appointment)null);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(async () => await handler.Handle(command, CancellationToken.None));

            await repository.Received(1).GetAppointmentByIdAsync(appointmentId);
            await repository.DidNotReceive().DeleteAppointmentAsync(Arg.Any<Guid>());
        }
    }
}