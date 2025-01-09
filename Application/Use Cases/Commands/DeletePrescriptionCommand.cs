using MediatR;
using System;

namespace Application.Use_Cases.Commands
{
  public class DeletePrescriptionCommand : IRequest<Unit>
  {
    public Guid Id { get; set; }
  }
}
