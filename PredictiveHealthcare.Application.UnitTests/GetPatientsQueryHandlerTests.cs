using Application.DTOs;
using Application.Use_Cases.Queries;
using Application.Use_Cases.QueryHandlers;
using AutoMapper;
using Domain.Entities;
using FluentAssertions;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace PredictiveHealthcare.Application.UnitTests
{
    public class GetPatientsQueryHandlerTests
    {
        private readonly IPatientRepository repository;
        private readonly IMapper mapper;
        private readonly GetPatientsQueryHandler handler;

        public GetPatientsQueryHandlerTests()
        {
            repository = Substitute.For<IPatientRepository>();
            mapper = Substitute.For<IMapper>();
            handler = new GetPatientsQueryHandler(repository, mapper);
        }

        [Fact]
        public async Task Given_ExistingPatients_When_HandleIsCalled_Then_PatientDTOListShouldBeReturned()
        {
            // Arrange
            var patients = new List<Patient>
                {
                    new Patient
                    {
                        PatientId = Guid.NewGuid(),
                        FirstName = "John",
                        LastName = "Doe",
                        DateOfBirth = new DateTime(1985, 5, 20),
                        Gender = Gender.Male,
                        ContactInformation = "123-456-7890",
                        Address = "123 Main St",
                        PhotoPath = "john_doe.png"
                    },
                    new Patient
                    {
                        PatientId = Guid.NewGuid(),
                        FirstName = "Jane",
                        LastName = "Doe",
                        DateOfBirth = new DateTime(1990, 7, 15),
                        Gender = Gender.Female,
                        ContactInformation = "098-765-4321",
                        Address = "456 Elm St",
                        PhotoPath = "jane_doe.png"
                    }
                };

            var patientDTOs = new List<PatientDto>
                {
                    new PatientDto
                    {
                        PatientId = patients[0].PatientId,
                        FirstName = patients[0].FirstName,
                        LastName = patients[0].LastName,
                        DateOfBirth = patients[0].DateOfBirth,
                        Gender = patients[0].Gender,
                        ContactInformation = patients[0].ContactInformation,
                        Address = patients[0].Address,
                        PhotoPath = patients[0].PhotoPath
                    },
                    new PatientDto
                    {
                        PatientId = patients[1].PatientId,
                        FirstName = patients[1].FirstName,
                        LastName = patients[1].LastName,
                        DateOfBirth = patients[1].DateOfBirth,
                        Gender = patients[1].Gender,
                        ContactInformation = patients[1].ContactInformation,
                        Address = patients[1].Address,
                        PhotoPath = patients[1].PhotoPath
                    }
                };

            repository.GetAllPatientsAsync(Arg.Any<int>(), Arg.Any<int>()).Returns(patients);
            mapper.Map<List<PatientDto>>(patients).Returns(patientDTOs);

            var query = new GetPatientsQuery();

            // Act
            var (result, totalCount) = await handler.Handle(query, CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(patientDTOs);
            await repository.Received(1).GetAllPatientsAsync(Arg.Any<int>(), Arg.Any<int>());
            mapper.Received(1).Map<List<PatientDto>>(patients);
        }

        [Fact]
        public async Task Given_NoPatients_When_HandleIsCalled_Then_EmptyListShouldBeReturned()
        {
            // Arrange
            var patients = new List<Patient>();
            repository.GetAllPatientsAsync(Arg.Any<int>(), Arg.Any<int>()).Returns(patients);

            var query = new GetPatientsQuery();

            // Act
            var (result, totalCount) = await handler.Handle(query, CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEmpty();
            await repository.Received(1).GetAllPatientsAsync(Arg.Any<int>(), Arg.Any<int>());
            mapper.DidNotReceive().Map<List<PatientDto>>(Arg.Any<List<Patient>>());
        }
    }
}
