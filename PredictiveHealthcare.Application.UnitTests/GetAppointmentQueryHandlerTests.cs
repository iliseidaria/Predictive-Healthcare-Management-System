using Application.DTOs;
using Application.Use_Cases.Queries;
using Application.Use_Cases.QueryHandlers;
using AutoMapper;
using Domain.Entities;
using FluentAssertions;
using Infrastructure.Repositories;
using NSubstitute;

namespace PredictiveHealthcare.Application.UnitTests
{
    public class GetAppointmentQueryHandlerTests
    {
        protected readonly IAppointmentRepository repository;
        protected readonly IMapper mapper;
        protected readonly GetAppointmentQueryHandler handler;

        public GetAppointmentQueryHandlerTests()
        {
            repository = Substitute.For<IAppointmentRepository>();
            mapper = Substitute.For<IMapper>();
            handler = new GetAppointmentQueryHandler(repository, mapper);
        }

        [Fact]
        public async Task Given_AppointmentsExist_When_HandleIsCalled_Then_ListOfAppointmentDTOsShouldBeReturned()
        {
            // Arrange
            var query = new GetAppointmentQuery() { Reason = "Routine Checkup" };

      var appointments = new List<Appointment>
            {
                new Appointment
                {
                    AppointmentId = Guid.NewGuid(),
                    PatientId = Guid.NewGuid(),
                    ProviderId = Guid.NewGuid(),
                    AppointmentDate = DateTime.UtcNow,
                    Reason = "Routine Checkup",
                    Status = AppointmentStatus.Scheduled
                },
                new Appointment
                {
                    AppointmentId = Guid.NewGuid(),
                    PatientId = Guid.NewGuid(),
                    ProviderId = Guid.NewGuid(),
                    AppointmentDate = DateTime.UtcNow.AddDays(1),
                    Reason = "Follow-up",
                    Status = AppointmentStatus.Completed
                }
            };

            var expectedDtos = new List<AppointmentDto>
            {
                new AppointmentDto
                {
                    AppointmentId = appointments[0].AppointmentId,
                    PatientId = appointments[0].PatientId,
                    ProviderId = appointments[0].ProviderId,
                    AppointmentDate = appointments[0].AppointmentDate,
                    Reason = appointments[0].Reason,
                    Status = appointments[0].Status
                },
                new AppointmentDto
                {
                    AppointmentId = appointments[1].AppointmentId,
                    PatientId = appointments[1].PatientId,
                    ProviderId = appointments[1].ProviderId,
                    AppointmentDate = appointments[1].AppointmentDate,
                    Reason = appointments[1].Reason,
                    Status = appointments[1].Status
                }
            };

            repository.GetAllAppointmentsAsync().Returns(appointments);
            mapper.Map<List<AppointmentDto>>(appointments).Returns(expectedDtos);

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            await repository.Received(1).GetAllAppointmentsAsync();
            mapper.Received(1).Map<List<AppointmentDto>>(appointments);
            result.Should().BeEquivalentTo(expectedDtos);
        }

        [Fact]
        public async Task Given_NoAppointmentsExist_When_HandleIsCalled_Then_EmptyListShouldBeReturned()
        {
            // Arrange
            var query = new GetAppointmentQuery() { Reason = "Routine Checkup" };

      var appointments = new List<Appointment>();
            var expectedDtos = new List<AppointmentDto>();

            repository.GetAllAppointmentsAsync().Returns(appointments);
            mapper.Map<List<AppointmentDto>>(appointments).Returns(expectedDtos);

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            await repository.Received(1).GetAllAppointmentsAsync();
            mapper.Received(1).Map<List<AppointmentDto>>(appointments);
            result.Should().BeEmpty();
        }
    }
}
