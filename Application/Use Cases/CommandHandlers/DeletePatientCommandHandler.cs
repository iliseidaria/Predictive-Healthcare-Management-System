﻿using Application.Use_Cases.Commands;
using MediatR;
using System.ComponentModel.DataAnnotations;

namespace Application.Use_Cases.CommandHandlers
{
    public class DeletePatientCommandHandler : IRequestHandler<DeletePatientCommand>
    {
        private readonly IPatientRepository repository;

        public DeletePatientCommandHandler(IPatientRepository repository)
        {
            this.repository = repository;
        }
        public async Task Handle(DeletePatientCommand request, CancellationToken cancellationToken)
        {
            // Validate the request
            DeletePatientCommandValidator validationRule = new DeletePatientCommandValidator();
            var validator = validationRule.Validate(request);
            if (!validator.IsValid)
            {
                var errorsResult = new List<string>();
                foreach (var error in validator.Errors)
                {
                    errorsResult.Add(error.ErrorMessage);
                }
                throw new ValidationException(string.Join(", ", errorsResult));
            }

            // Check if the patient exists
            var existingPatient = await repository.GetPatientByIdAsync(request.Id);
            if (existingPatient == null)
            {
                throw new KeyNotFoundException("Patient not found");
            }

            // Delete the patient
            await repository.DeletePatientAsync(request.Id);
        }

    }
}
