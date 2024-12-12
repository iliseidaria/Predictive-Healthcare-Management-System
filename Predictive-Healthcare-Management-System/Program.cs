using Infrastructure;
using Application;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Repositories;
using Application.Utils;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Options;
using Application.Use_Cases.CommandHandlers;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Diagnostics;
using Application.Services;

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
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserService>();
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

// Configure JwtSettings
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddSingleton(resolver => resolver.GetRequiredService<IOptions<JwtSettings>>().Value);

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
      var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
      options.TokenValidationParameters = new TokenValidationParameters
      {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
      };
    });

builder.Services.AddAuthorization(options =>
{
  options.AddPolicy("RequireAdminRole", policy =>
      policy.RequireRole("Admin"));  // Numai Admin
  options.AddPolicy("RequireDoctorRole", policy =>
      policy.RequireRole("Doctor")); // Numai Doctor
  options.AddPolicy("RequirePatientRole", policy =>
      policy.RequireRole("Patient")); // Numai Pacient
  options.AddPolicy("RequireAdminOrDoctorRole", policy =>
      policy.RequireRole("Admin", "Doctor")); // Ambele roluri
});

// Register MediatR and Validators
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));
builder.Services.AddValidatorsFromAssemblyContaining<CreatePatientCommandValidator>();
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

var app = builder.Build();

// Seed admin user
using (var scope = app.Services.CreateScope())
{
  var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
  DataSeeder.SeedAdminUser(context);
}

// Configurare Middleware
if (app.Environment.IsDevelopment())
{
  app.UseDeveloperExceptionPage();
  app.UseSwagger();
  app.UseSwaggerUI();
}

// Gestionează erorile în producție
if (!app.Environment.IsDevelopment())
{
  app.UseExceptionHandler("/error");
}

app.UseExceptionHandler(appBuilder =>
{
  appBuilder.Run(async context =>
  {
    context.Response.StatusCode = 400;
    context.Response.ContentType = "application/json";
    var exception = context.Features.Get<IExceptionHandlerPathFeature>()?.Error;
    await context.Response.WriteAsJsonAsync(new { message = exception?.Message });
  });
});

// Elimină HTTPS (dacă este cazul)
app.UseCors("AllowAngularApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
