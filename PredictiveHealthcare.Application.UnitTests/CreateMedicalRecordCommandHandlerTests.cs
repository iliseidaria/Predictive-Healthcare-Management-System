using Application.Use_Cases.Commands;
using Application.Use_Cases.CommandHandlers;
using AutoMapper;
using Domain.Entities;
using FluentAssertions;
using NSubstitute;

namespace PredictiveHealthcare.Application.UnitTests
{
    public class CreateMedicalRecordCommandHandlerTests
    {
        private readonly IMedicalRecordRepository repository;
        private readonly IMapper mapper;
        private readonly CreateMedicalRecordCommandHandler handler;

        public CreateMedicalRecordCommandHandlerTests()
        {
            repository = Substitute.For<IMedicalRecordRepository>();
            mapper = Substitute.For<IMapper>();
            handler = new CreateMedicalRecordCommandHandler(repository, mapper);
        }

        [Fact]
        public async Task Given_ValidCreateMedicalRecordCommand_When_HandleIsCalled_Then_MedicalRecordShouldBeCreated()
        {
            // Arrange
            var command = new CreateMedicalRecordCommand
            {
                PatientId = Guid.NewGuid(),
                Date = DateTime.Now,
                Diagnosis = "Diagnosis example",
                Notes = "Notes example"
            };

            var medicalRecord = new MedicalRecord
            {
                RecordId = Guid.NewGuid(),
                PatientId = command.PatientId,
                Date = command.Date,
                Diagnosis = command.Diagnosis,
                Notes = command.Notes
            };

            mapper.Map<MedicalRecord>(command).Returns(medicalRecord);
            repository.AddMedicalRecordAsync(medicalRecord).Returns(medicalRecord.RecordId);

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            await repository.Received(1).AddMedicalRecordAsync(medicalRecord);
            result.Should().Be(medicalRecord.RecordId);
        }

        [Fact]
        public async Task Given_InvalidCreateMedicalRecordCommand_When_HandleIsCalled_Then_ExceptionShouldBeThrown()
        {
            // Arrange
            var command = new CreateMedicalRecordCommand
            {
                PatientId = Guid.NewGuid(),
                Date = DateTime.Now,
                Diagnosis = "Diagnosis example",
                Notes = "Notes example"
            };

            var medicalRecord = new MedicalRecord
            {
                RecordId = Guid.NewGuid(),
                PatientId = command.PatientId,
                Date = command.Date,
                Diagnosis = command.Diagnosis,
                Notes = command.Notes
            };

            mapper.Map<MedicalRecord>(command).Returns(medicalRecord);
            repository.AddMedicalRecordAsync(medicalRecord).Returns<Guid>(x => throw new Exception("Error adding medical record"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(async () => await handler.Handle(command, CancellationToken.None));

            await repository.Received(1).AddMedicalRecordAsync(medicalRecord);
        }
    }
}