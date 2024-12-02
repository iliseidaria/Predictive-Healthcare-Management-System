using Application.Use_Cases.Commands;
using Application.Use_Cases.CommandHandlers;
using Domain.Entities;
using FluentAssertions;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using MediatR;

namespace PredictiveHealthcare.Application.UnitTests
{
    public class DeletePatientCommandHandlerTests
    {
        private readonly IPatientRepository repository;
        private readonly DeletePatientCommandHandler handler;

        public DeletePatientCommandHandlerTests()
        {
            repository = Substitute.For<IPatientRepository>();
            handler = new DeletePatientCommandHandler(repository);
        }

        [Fact]
        public async Task Given_ExistingPatient_When_HandleIsCalled_Then_PatientShouldBeDeleted()
        {
            // Arrange
            var patientId = Guid.NewGuid();
            var command = new DeletePatientCommand { Id = patientId };

            // Simulate existing patient found
            repository.GetPatientByIdAsync(patientId).Returns(new Patient { PatientId = patientId });

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            await repository.Received(1).GetPatientByIdAsync(patientId);
            await repository.Received(1).DeletePatientAsync(patientId);
            result.Should().Be(Unit.Value);  
        }

        [Fact]
        public async Task Given_NonExistentPatient_When_HandleIsCalled_Then_KeyNotFoundExceptionShouldBeThrown()
        {
            // Arrange
            var patientId = Guid.NewGuid();
            var command = new DeletePatientCommand { Id = patientId };

            // Simulate no patient found
            repository.GetPatientByIdAsync(patientId).Returns((Patient)null);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => handler.Handle(command, CancellationToken.None));

            await repository.Received(1).GetPatientByIdAsync(patientId);
            await repository.DidNotReceive().DeletePatientAsync(Arg.Any<Guid>()); 
        }
    }
}
