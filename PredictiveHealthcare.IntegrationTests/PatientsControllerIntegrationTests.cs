using Application.Use_Cases.Commands;
using Domain.Entities;
using FluentAssertions;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using System.Net.Http.Json;

namespace PredictiveHealthcare.Integration.Tests
{
    public class PatientsControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>, IDisposable
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly ApplicationDbContext _dbContext;
        private readonly HttpClient _client;
        private const string BaseUrl = "/api/v1/patients";

        public PatientsControllerIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    var descriptor = services.SingleOrDefault(
                        d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));

                    if (descriptor != null)
                    {
                        services.Remove(descriptor);
                    }

                    services.AddDbContext<ApplicationDbContext>(options =>
                    {
                        options.UseInMemoryDatabase("InMemoryDbForTesting");
                    });
                });
            });

            var scope = _factory.Services.CreateScope();
            _dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            _dbContext.Database.EnsureCreated();
            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task GivenPatients_WhenGetAllIsCalled_ThenReturnsTheRightContentType()
        {
            // Act
            var response = await _client.GetAsync(BaseUrl);

            // Assert
            response.EnsureSuccessStatusCode();
            response.Content.Headers.ContentType!.ToString().Should().Be("application/json; charset=utf-8");
        }

        [Fact]
        public async Task GivenExistingPatients_WhenGetAllIsCalled_ThenReturnsTheRightPatients()
        {
            // Arrange
            CreateSut();

            // Act
            var response = await _client.GetAsync(BaseUrl);

            // Assert
            response.EnsureSuccessStatusCode();
            var patients = await response.Content.ReadAsStringAsync();
            patients.Should().Contain("John Doe");
        }

        [Fact]
        public async Task GivenValidPatient_WhenCreatedIsCalled_Then_ShouldAddToDatabaseThePatient()
        {
            // Arrange
            var command = new CreatePatientCommand
            {
                FirstName = "John",
                LastName = "Doe",
                DateOfBirth = new DateTime(1990, 1, 1),
                Gender = Gender.Male,
                ContactInformation = "123456789",
                Address = "123 Main St"
            };

            // Act
            await _client.PostAsJsonAsync(BaseUrl, command);

            // Assert
            var patient = await _dbContext.Patients.FirstOrDefaultAsync(p => p.FirstName == "John" && p.LastName == "Doe");
            patient.Should().NotBeNull();
        }

        public void Dispose()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        private void CreateSut()
        {
            var patient = new Patient
            {
                PatientId = Guid.NewGuid(),
                FirstName = "John",
                LastName = "Doe",
                DateOfBirth = new DateTime(1990, 1, 1),
                Gender = Gender.Male,
                ContactInformation = "123456789",
                Address = "123 Main St"
            };
            _dbContext.Patients.Add(patient);
            _dbContext.SaveChanges();
        }
    }
}
