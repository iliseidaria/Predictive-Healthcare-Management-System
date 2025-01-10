using Domain.Entities;
using MediatR;

public class GetPrescriptionsByPatientIdQueryHandler : IRequestHandler<GetPrescriptionsByPatientIdQuery, List<Prescription>>
   {
       private readonly IPrescriptionRepository _prescriptionRepository;

       public GetPrescriptionsByPatientIdQueryHandler(IPrescriptionRepository prescriptionRepository)
       {
           _prescriptionRepository = prescriptionRepository;
       }

       public async Task<List<Prescription>> Handle(GetPrescriptionsByPatientIdQuery request, CancellationToken cancellationToken)
       {
           return await _prescriptionRepository.GetPrescriptionsByPatientIdAsync(request.PatientId);
       }
   }
