﻿using Infrastructure.Persistence;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure
{
    public static class DepedencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>(
                    options => options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
                );
            services.AddScoped<IPatientRepository, PatientRepository>();
            return services;
        }
    }
}
