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
      /*
      CreateMap<Patient, PatientDto>().ReverseMap();
      CreateMap<CreatePatientCommand, Patient>().ReverseMap();
      CreateMap<CreatePatientCommand, Patient>()
            .ForMember(dest => dest.DateOfBirth, opt =>
              opt.MapFrom(src => DateTime.SpecifyKind(src.DateOfBirth, DateTimeKind.Utc))
            );
      CreateMap<UpdatePatientCommand, Patient>().ReverseMap();*/
      //User mappings
      CreateMap<User, UserDto>().ReverseMap();
     // CreateMap<, Patient>().ReverseMap();
      CreateMap<CreateUserCommand, User>()
            .ForMember(dest => dest.DateOfBirth, opt =>
              opt.MapFrom(src => DateTime.SpecifyKind(src.DateOfBirth, DateTimeKind.Utc))
            );
      CreateMap<UpdatePatientCommand, User>().ReverseMap();

      // MedicalRecord mappings
      CreateMap<MedicalRecord, MedicalRecordDto>().ReverseMap();
            CreateMap<CreateMedicalRecordCommand, MedicalRecord>().ReverseMap();
            CreateMap<UpdateMedicalRecordCommand, MedicalRecord>().ReverseMap();

            //Prescription mappings
            CreateMap<Prescription, PrescriptionDto>().ReverseMap();
            CreateMap<AddPrescriptionCommand, Prescription>().ReverseMap();
            CreateMap<AddPrescriptionCommand, Prescription>()
                  .ForMember(dest => dest.StartDate, opt =>
                    opt.MapFrom(src => DateTime.SpecifyKind(src.StartDate, DateTimeKind.Utc))
                  )
                  .ForMember(dest => dest.EndDate, opt =>
                    opt.MapFrom(src => DateTime.SpecifyKind(src.EndDate, DateTimeKind.Utc))
                  );
            CreateMap<UpdatePrescriptionCommand, Prescription>().ReverseMap();

      // Appointment mappings
      CreateMap<Appointment, AppointmentDto>().ReverseMap();
            //CreateMap<CreateAppointmentCommand, Appointment>().ReverseMap();
      CreateMap<UpdateAppointmentCommand, Appointment>().ReverseMap();

      CreateMap<CreateAppointmentCommand, Appointment>()
            .ForMember(dest => dest.Status,
                      opt => opt.MapFrom(src => src.Status))
            .AfterMap((src, dest) => {
              if (dest.Status == 0)
                dest.Status = AppointmentStatus.Scheduled;
            });

    }
    }
}
