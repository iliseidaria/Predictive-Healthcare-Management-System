using Application.Use_Cases.Commands;
using Application.Use_Cases.CommandHandlers;
using AutoMapper;
using Domain.Entities;
using FluentAssertions;
using NSubstitute;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace PredictiveHealthcare.Application.UnitTests
{
    public class CreatePatientCommandHandlerTests
    {
        private readonly IPatientRepository repository;
        private readonly IMapper mapper;
        private readonly CreatePatientCommandHandler handler;

        public CreatePatientCommandHandlerTests()
        {
            repository = Substitute.For<IPatientRepository>();
            mapper = Substitute.For<IMapper>();
            handler = new CreatePatientCommandHandler(repository, mapper);
        }

        [Fact]
        public async Task Given_ValidCreatePatientCommand_When_HandleIsCalled_Then_PatientShouldBeCreated()
        {
            // Arrange
            var command = new CreatePatientCommand
            {
                FirstName = "John",
                LastName = "Doe",
                DateOfBirth = new DateTime(1990, 1, 1),
                Gender = Gender.Male,
                ContactInformation = "1234567890",
                Address = "123 Street",
            };

            var patient = new Patient
            {
                PatientId = Guid.NewGuid(),
                FirstName = command.FirstName,
                LastName = command.LastName,
                DateOfBirth = command.DateOfBirth,
                Gender = command.Gender,
                ContactInformation = command.ContactInformation,
                Address = command.Address,
            };

            mapper.Map<Patient>(command).Returns(patient);
            repository.AddPatientAsync(patient).Returns(patient.PatientId);

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            await repository.Received(1).AddPatientAsync(patient);
            result.Should().Be(patient.PatientId);  
        }

        [Fact]
        public async Task Given_InvalidCreatePatientCommand_When_HandleIsCalled_Then_ExceptionShouldBeThrown()
        {
            // Arrange
            var command = new CreatePatientCommand
            {
                FirstName = "John",
                LastName = "Doe",
                DateOfBirth = new DateTime(1990, 1, 1),
                Gender = Gender.Male,
                ContactInformation = "1234567890",
                Address = "123 Street",
            };

            var patient = new Patient
            {
                PatientId = Guid.NewGuid(),
                FirstName = command.FirstName,
                LastName = command.LastName,
                DateOfBirth = command.DateOfBirth,
                Gender = command.Gender,
                ContactInformation = command.ContactInformation,
                Address = command.Address,
            };

            // Configure mapper and repository to throw an exception
            mapper.Map<Patient>(command).Returns(patient);
            repository.AddPatientAsync(patient).Returns<Guid>(x => throw new Exception("Error adding patient"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(async () => await handler.Handle(command, CancellationToken.None));

            await repository.Received(1).AddPatientAsync(patient);
        }
    }
}
