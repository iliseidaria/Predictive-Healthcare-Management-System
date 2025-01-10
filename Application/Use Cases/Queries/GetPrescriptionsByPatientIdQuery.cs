using Domain.Entities;
using MediatR;

public class GetPrescriptionsByPatientIdQuery : IRequest<List<Prescription>>
   {
       public Guid PatientId { get; set; }
   }
