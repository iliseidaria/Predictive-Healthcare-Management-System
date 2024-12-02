using Application.Use_Cases.CommandHandlers;
using Application.Utils;
using FluentValidation;
using Infrastructure.Repositories;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(MappingProfile));
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
            services.AddValidatorsFromAssemblyContaining<CreatePatientCommandValidator>();
            //services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly); //nuj daca i corect asa
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            //services.AddTransient<IMedicalRecordRepository, MedicalRecordRepository>();
            return services;
        }
    }
}
