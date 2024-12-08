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
            CreateMap<Patient, PatientDTO>().ReverseMap();
            CreateMap<CreatePatientCommand, Patient>().ReverseMap();
            CreateMap<CreatePatientCommand, Patient>()
                  .ForMember(dest => dest.DateOfBirth, opt =>
                    opt.MapFrom(src => DateTime.SpecifyKind(src.DateOfBirth, DateTimeKind.Utc))
                  );
            CreateMap<UpdatePatientCommand, Patient>().ReverseMap();

            // MedicalRecord mappings
            CreateMap<MedicalRecord, MedicalRecordDTO>().ReverseMap();
            CreateMap<CreateMedicalRecordCommand, MedicalRecord>().ReverseMap();
            CreateMap<UpdateMedicalRecordCommand, MedicalRecord>().ReverseMap();
            //CreateMap<Prescription, PrescriptionDTO>().ReverseMap();

            // Appointment mappings
            CreateMap<Appointment, AppointmentDTO>().ReverseMap();
            CreateMap<CreateAppointmentCommand, Appointment>().ReverseMap();
            CreateMap<UpdateAppointmentCommand, Appointment>().ReverseMap();

        }
    }
}
