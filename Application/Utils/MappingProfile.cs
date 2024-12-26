using Application.DTOs;
using Domain.Entities;
using AutoMapper;
using Application.Use_Cases.Commands;

namespace Application.Utils
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Patient mappings
            CreateMap<Patient, PatientDto>().ReverseMap();
            CreateMap<CreatePatientCommand, Patient>().ReverseMap();
            CreateMap<CreatePatientCommand, Patient>()
                  .ForMember(dest => dest.DateOfBirth, opt =>
                    opt.MapFrom(src => DateTime.SpecifyKind(src.DateOfBirth, DateTimeKind.Utc))
                  );
            CreateMap<UpdatePatientCommand, Patient>().ReverseMap();

            // MedicalRecord mappings
            CreateMap<MedicalRecord, MedicalRecordDto>().ReverseMap();
            CreateMap<CreateMedicalRecordCommand, MedicalRecord>().ReverseMap();
            CreateMap<UpdateMedicalRecordCommand, MedicalRecord>().ReverseMap();
            //CreateMap<Prescription, PrescriptionDTO>().ReverseMap();

            // Appointment mappings
            CreateMap<Appointment, AppointmentDto>().ReverseMap();
            CreateMap<CreateAppointmentCommand, Appointment>().ReverseMap();
            CreateMap<UpdateAppointmentCommand, Appointment>().ReverseMap();

        }
    }
}
