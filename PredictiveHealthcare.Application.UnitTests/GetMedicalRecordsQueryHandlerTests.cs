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
    public class GetMedicalRecordsQueryHandlerTests
    {
        private readonly IMedicalRecordRepository repository;
        private readonly IMapper mapper;
        private readonly GetMedicalRecordsQueryHandler handler;

        public GetMedicalRecordsQueryHandlerTests()
        {
            repository = Substitute.For<IMedicalRecordRepository>();
            mapper = Substitute.For<IMapper>();
            handler = new GetMedicalRecordsQueryHandler(repository, mapper);
        }

        [Fact]
        public async Task Given_ExistingMedicalRecords_When_HandleIsCalled_Then_ListOfMedicalRecordDTOsShouldBeReturned()
        {
            // Arrange
            var query = new GetMedicalRecordsQuery();

            var medicalRecords = new List<MedicalRecord>
            {
                new MedicalRecord { RecordId = Guid.NewGuid(), PatientId = Guid.NewGuid(), Date = DateTime.Now, Diagnosis = "Diagnosis 1", Notes = "Notes 1" },
                new MedicalRecord { RecordId = Guid.NewGuid(), PatientId = Guid.NewGuid(), Date = DateTime.Now, Diagnosis = "Diagnosis 2", Notes = "Notes 2" }
            };

            var expectedDtos = new List<MedicalRecordDTO>
            {
                new MedicalRecordDTO { RecordId = medicalRecords[0].RecordId, PatientId = medicalRecords[0].PatientId, Date = medicalRecords[0].Date, Diagnosis = "Diagnosis 1", Notes = "Notes 1" },
                new MedicalRecordDTO { RecordId = medicalRecords[1].RecordId, PatientId = medicalRecords[1].PatientId, Date = medicalRecords[1].Date, Diagnosis = "Diagnosis 2", Notes = "Notes 2" }
            };

            repository.GetMedicalRecordsAsync().Returns(medicalRecords);
            mapper.Map<List<MedicalRecordDTO>>(medicalRecords).Returns(expectedDtos);

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            await repository.Received(1).GetMedicalRecordsAsync();
            mapper.Received(1).Map<List<MedicalRecordDTO>>(medicalRecords);
            result.Should().BeEquivalentTo(expectedDtos);
        }

        [Fact]
        public async Task Given_NoMedicalRecords_When_HandleIsCalled_Then_EmptyListShouldBeReturned()
        {
            // Arrange
            var query = new GetMedicalRecordsQuery();

            var medicalRecords = new List<MedicalRecord>();
            var expectedDtos = new List<MedicalRecordDTO>();

            repository.GetMedicalRecordsAsync().Returns(medicalRecords);
            mapper.Map<List<MedicalRecordDTO>>(medicalRecords).Returns(expectedDtos);

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            await repository.Received(1).GetMedicalRecordsAsync();
            mapper.Received(1).Map<List<MedicalRecordDTO>>(medicalRecords);
            result.Should().BeEmpty();
        }
    }
}