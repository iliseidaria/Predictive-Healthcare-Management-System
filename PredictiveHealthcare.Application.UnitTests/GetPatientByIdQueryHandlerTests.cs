using Application.DTOs;
using Application.Use_Cases.Queries;
using Application.Use_Cases.QueryHandlers;
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
    public class GetPatientByIdQueryHandlerTests
    {
        private readonly IPatientRepository repository;
        private readonly IMapper mapper;
        private readonly GetPatientByIdQueryHandler handler;

        public GetPatientByIdQueryHandlerTests()
        {
            repository = Substitute.For<IPatientRepository>();
            mapper = Substitute.For<IMapper>();
            handler = new GetPatientByIdQueryHandler(repository, mapper);
        }

        [Fact]
        public async Task Given_ExistingPatient_When_HandleIsCalled_Then_PatientDTOShouldBeReturned()
        {
            // Arrange
            var patientId = Guid.NewGuid();
            var patient = new Patient
            {
                PatientId = patientId,
                FirstName = "John",
                LastName = "Doe",
                DateOfBirth = new DateTime(1985, 5, 20),
                Gender = Gender.Male,
                ContactInformation = "123-456-7890",
                Address = "123 Main St",
                PhotoPath = "john_doe.png"
            };

            var patientDTO = new PatientDto
            {
                PatientId = patient.PatientId,
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                DateOfBirth = patient.DateOfBirth,
                Gender = patient.Gender,
                ContactInformation = patient.ContactInformation,
                Address = patient.Address,
                PhotoPath = patient.PhotoPath
            };

            repository.GetPatientByIdAsync(patientId).Returns(patient);
            mapper.Map<PatientDto>(patient).Returns(patientDTO);

            var query = new GetPatientByIdQuery { Id = patientId };

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(patientDTO);
            await repository.Received(1).GetPatientByIdAsync(patientId);
            mapper.Received(1).Map<PatientDto>(patient);
        }

        [Fact]
        public async Task Given_NonExistentPatient_When_HandleIsCalled_Then_NullShouldBeReturned()
        {
            // Arrange
            var patientId = Guid.NewGuid();
            repository.GetPatientByIdAsync(patientId).Returns(Task.FromResult<Patient>(null));

            var query = new GetPatientByIdQuery { Id = patientId };

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            result.Should().BeNull();
            await repository.Received(1).GetPatientByIdAsync(patientId);
            mapper.DidNotReceive().Map<PatientDto>(Arg.Any<Patient>());
        }
    }
}
