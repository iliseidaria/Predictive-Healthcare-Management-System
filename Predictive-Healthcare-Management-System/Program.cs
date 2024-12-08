using Infrastructure;
using Application;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Configurare Servicii
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddControllers();

// Configurare DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("Infrastructure")));

// Înregistrare Repozitorii
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IMedicalRecordRepository, MedicalRecordRepository>();

// Configurare CORS
builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowAngularApp", policy =>
  {
    policy.WithOrigins("http://localhost:4200") // Schimbă portul frontend-ului
          .AllowAnyHeader()
          .AllowAnyMethod();
  });
});

// Dezactivează HTTPS
builder.Services.AddHttpsRedirection(options =>
{
  options.HttpsPort = null; // Dezactivează HTTPS
});

// Configurare Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configurare Middleware
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

// Gestionează erorile în producție
if (!app.Environment.IsDevelopment())
{
  app.UseExceptionHandler("/error");
}

// Elimină HTTPS (dacă este cazul)
app.UseCors("AllowAngularApp");

app.UseAuthorization();

app.MapControllers();

app.Run();
