using Application.Use_Cases.Commands;
using Application.Use_Cases.CommandHandlers;
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
    public class DeleteMedicalRecordCommandHandlerTests
    {
        private readonly IMedicalRecordRepository repository;
        private readonly DeleteMedicalRecordCommandHandler handler;

        public DeleteMedicalRecordCommandHandlerTests()
        {
            repository = Substitute.For<IMedicalRecordRepository>();
            handler = new DeleteMedicalRecordCommandHandler(repository);
        }

        [Fact]
        public async Task Given_ExistingMedicalRecord_When_HandleIsCalled_Then_MedicalRecordShouldBeDeleted()
        {
            // Arrange
            var medicalRecordId = Guid.NewGuid();
            var command = new DeleteMedicalRecordCommand { Id = medicalRecordId };

            repository.GetMedicalRecordByIdAsync(medicalRecordId).Returns(new MedicalRecord { RecordId = medicalRecordId });

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            await repository.Received(1).GetMedicalRecordByIdAsync(medicalRecordId);
            await repository.Received(1).DeleteMedicalRecordAsync(medicalRecordId);
            result.Should().Be(Unit.Value);
        }

        [Fact]
        public async Task Given_NonExistingMedicalRecord_When_HandleIsCalled_Then_KeyNotFoundExceptionShouldBeThrown()
        {
            // Arrange
            var medicalRecordId = Guid.NewGuid();
            var command = new DeleteMedicalRecordCommand { Id = medicalRecordId };

            repository.GetMedicalRecordByIdAsync(medicalRecordId).Returns((MedicalRecord)null);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(async () => await handler.Handle(command, CancellationToken.None));

            await repository.Received(1).GetMedicalRecordByIdAsync(medicalRecordId);
            await repository.DidNotReceive().DeleteMedicalRecordAsync(Arg.Any<Guid>());
        }
    }
}