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
    public class GetMedicalRecordByIdQueryHandlerTests
    {
        private readonly IMedicalRecordRepository repository;
        private readonly IMapper mapper;
        private readonly GetMedicalRecordByIdQueryHandler handler;

        public GetMedicalRecordByIdQueryHandlerTests()
        {
            repository = Substitute.For<IMedicalRecordRepository>();
            mapper = Substitute.For<IMapper>();
            handler = new GetMedicalRecordByIdQueryHandler(repository, mapper);
        }

        [Fact]
        public async Task Given_ExistingMedicalRecord_When_HandleIsCalled_Then_MedicalRecordDTOShouldBeReturned()
        {
            // Arrange
            var medicalRecordId = Guid.NewGuid();
            var query = new GetMedicalRecordByIdQuery { Id = medicalRecordId };

            var medicalRecord = new MedicalRecord
            {
                RecordId = medicalRecordId,
                PatientId = Guid.NewGuid(),
                Date = DateTime.Now,
                Diagnosis = "Sample Diagnosis",
                Notes = "Sample Notes"
            };

            var expectedDto = new MedicalRecordDTO
            {
                RecordId = medicalRecordId,
                PatientId = medicalRecord.PatientId,
                Date = medicalRecord.Date,
                Diagnosis = "Sample Diagnosis",
                Notes = "Sample Notes"
            };

            repository.GetMedicalRecordByIdAsync(medicalRecordId).Returns(medicalRecord);
            mapper.Map<MedicalRecordDTO>(medicalRecord).Returns(expectedDto);

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            await repository.Received(1).GetMedicalRecordByIdAsync(medicalRecordId);
            mapper.Received(1).Map<MedicalRecordDTO>(medicalRecord);
            result.Should().BeEquivalentTo(expectedDto);
        }

        [Fact]
        public async Task Given_NonExistingMedicalRecord_When_HandleIsCalled_Then_NullShouldBeReturned()
        {
            // Arrange
            var medicalRecordId = Guid.NewGuid();
            var query = new GetMedicalRecordByIdQuery { Id = medicalRecordId };

            // Set up repository to return null, indicating the record does not exist
            repository.GetMedicalRecordByIdAsync(medicalRecordId).Returns((MedicalRecord?)null);

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            await repository.Received(1).GetMedicalRecordByIdAsync(medicalRecordId);
            mapper.DidNotReceive().Map<MedicalRecordDTO>(Arg.Any<MedicalRecord>());
            result.Should().BeNull();
        }
    }
}