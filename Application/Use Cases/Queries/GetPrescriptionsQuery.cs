using Application.DTOs;
using MediatR;
using System.Collections.Generic;

namespace Application.Use_Cases.Queries
{
  public class GetPrescriptionsQuery : IRequest<(List<PrescriptionDto> Prescriptions, int TotalCount)>
  {
    public int Page { get; set; }
    public int Size { get; set; }
  }
}
