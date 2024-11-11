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
            CreateMap<UpdatePatientCommand, Patient>().ReverseMap();

            // MedicalRecord mappings
            CreateMap<MedicalRecord, MedicalRecordDTO>().ReverseMap();
            CreateMap<CreateMedicalRecordCommand, MedicalRecord>().ReverseMap();
            //CreateMap<Prescription, PrescriptionDTO>().ReverseMap();
        }
    }
}