// Domain/Interfaces/IAppointmentRepository.cs
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IAppointmentRepository
{
    Task<List<Appointment>> GetAllByPatientIdAsync(Guid patientId);
    Task<Appointment> GetByIdAsync(Guid appointmentId);
    Task<bool> AddAsync(Appointment appointment);
    Task<bool> UpdateAsync(Appointment appointment);
    Task<bool> DeleteAsync(Guid appointmentId);
}