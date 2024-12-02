using Application.Use_Cases.Commands;
using Application.Use_Cases.CommandHandlers;
using AutoMapper;
using Domain.Entities;
using FluentAssertions;
using MediatR;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace PredictiveHealthcare.Application.UnitTests
{
    public class UpdateMedicalRecordCommandHandlerTests
    {
        private readonly IMedicalRecordRepository repository;
        private readonly IMapper mapper;
        private readonly UpdateMedicalRecordCommandHandler handler;

        public UpdateMedicalRecordCommandHandlerTests()
        {
            repository = Substitute.For<IMedicalRecordRepository>();
            mapper = Substitute.For<IMapper>();
            handler = new UpdateMedicalRecordCommandHandler(repository, mapper);
        }

        [Fact]
        public async Task Given_ExistingMedicalRecord_When_HandleIsCalled_Then_MedicalRecordShouldBeUpdated()
        {
            // Arrange
            var medicalRecordId = Guid.NewGuid();
            var command = new UpdateMedicalRecordCommand
            {
                RecordId = medicalRecordId,
                PatientId = Guid.NewGuid(),
                Date = DateTime.Now,
                Diagnosis = "Updated Diagnosis",
                Notes = "Updated Notes"
            };

            var existingRecord = new MedicalRecord
            {
                RecordId = medicalRecordId,
                PatientId = Guid.NewGuid(),
                Date = DateTime.Now,
                Diagnosis = "Old Diagnosis",
                Notes = "Old Notes"
            };

            var updatedRecord = new MedicalRecord
            {
                RecordId = medicalRecordId,
                PatientId = command.PatientId,
                Date = command.Date,
                Diagnosis = command.Diagnosis,
                Notes = command.Notes
            };

            repository.GetMedicalRecordByIdAsync(medicalRecordId).Returns(existingRecord);
            mapper.Map<MedicalRecord>(command).Returns(updatedRecord);

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            await repository.Received(1).GetMedicalRecordByIdAsync(medicalRecordId);
            repository.Received(1).Detach(existingRecord);
            await repository.Received(1).UpdateAsync(updatedRecord);
            result.Should().Be(Unit.Value);
        }

        [Fact]
        public async Task Given_NonExistingMedicalRecord_When_HandleIsCalled_Then_KeyNotFoundExceptionShouldBeThrown()
        {
            // Arrange
            var medicalRecordId = Guid.NewGuid();
            var command = new UpdateMedicalRecordCommand
            {
                RecordId = medicalRecordId,
                PatientId = Guid.NewGuid(),
                Date = DateTime.Now,
                Diagnosis = "Updated Diagnosis",
                Notes = "Updated Notes"
            };

            repository.GetMedicalRecordByIdAsync(medicalRecordId).Returns((MedicalRecord?)null);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(async () => await handler.Handle(command, CancellationToken.None));

            await repository.Received(1).GetMedicalRecordByIdAsync(medicalRecordId);
            repository.DidNotReceive().Detach(Arg.Any<MedicalRecord>());
            await repository.DidNotReceive().UpdateAsync(Arg.Any<MedicalRecord>());
        }
    }
}