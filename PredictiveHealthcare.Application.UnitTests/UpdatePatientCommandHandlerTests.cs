using Application.Use_Cases.Commands;
using Application.CommandHandlers;
using AutoMapper;
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
    public class UpdatePatientCommandHandlerTests
    {
        private readonly IPatientRepository repository;
        private readonly IMapper mapper;
        private readonly UpdatePatientCommandHandler handler;

        public UpdatePatientCommandHandlerTests()
        {
            repository = Substitute.For<IPatientRepository>();
            mapper = Substitute.For<IMapper>();
            handler = new UpdatePatientCommandHandler(repository, mapper);
        }

        [Fact]
        public async Task Given_ExistingPatient_When_HandleIsCalled_Then_PatientShouldBeUpdated()
        {
            // Arrange
            var patientId = Guid.NewGuid();
            var command = new UpdatePatientCommand
            {
                PatientId = patientId,
                FirstName = "UpdatedName",
                LastName = "UpdatedLastName",
                DateOfBirth = new DateTime(1990, 1, 1),
                Gender = Gender.Female,
                ContactInformation = "UpdatedContact",
                Address = "UpdatedAddress"
            };
            var existingPatient = new Patient { PatientId = patientId };

            // Configure repository and mapper
            repository.GetPatientByIdAsync(patientId).Returns(existingPatient);
            var mappedPatient = new Patient { PatientId = patientId, FirstName = "UpdatedName" };
            mapper.Map<Patient>(command).Returns(mappedPatient);

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            await repository.Received(1).GetPatientByIdAsync(patientId);
            repository.Received(1).Detach(existingPatient);  
            await repository.Received(1).UpdateAsync(mappedPatient);
            result.Should().Be(Unit.Value);  
        }

        [Fact]
        public async Task Given_NonExistentPatient_When_HandleIsCalled_Then_KeyNotFoundExceptionShouldBeThrown()
        {
            // Arrange
            var patientId = Guid.NewGuid();
            var command = new UpdatePatientCommand
            {
                PatientId = patientId,
                FirstName = "Vaida",
                LastName = "Mirela",
                DateOfBirth = new DateTime(1990, 1, 1),
                Gender = Gender.Female,
                ContactInformation = "0788453827",
                Address = "Str Nu e Roz"
            };

            // Simulate patient not found
            repository.GetPatientByIdAsync(patientId).Returns((Patient)null);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => handler.Handle(command, CancellationToken.None));

            await repository.Received(1).GetPatientByIdAsync(patientId);
            repository.DidNotReceive().Detach(Arg.Any<Patient>());  
            await repository.DidNotReceive().UpdateAsync(Arg.Any<Patient>()); 
        }
    }
}
