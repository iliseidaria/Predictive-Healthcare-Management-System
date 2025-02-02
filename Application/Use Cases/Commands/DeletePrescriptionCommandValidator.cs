using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Use_Cases.Commands
{
  internal class DeletePrescriptionCommandValidator : AbstractValidator<DeletePrescriptionCommand>
  {
    public DeletePrescriptionCommandValidator()
    {
      RuleFor(x => x.Id)
          .NotEmpty()
          .WithMessage("Prescription ID must not be empty.");
    }
  }
}
