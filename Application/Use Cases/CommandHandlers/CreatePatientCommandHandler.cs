using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Entities;
using MediatR;
using System.ComponentModel.DataAnnotations;

namespace Application.Use_Cases.CommandHandlers
{
    public class CreatePatientCommandHandler : IRequestHandler<CreatePatientCommand, Guid>
    {
        private readonly IPatientRepository repository;
        private readonly IMapper mapper;

        public CreatePatientCommandHandler(IPatientRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<Guid> Handle(CreatePatientCommand request, CancellationToken cancellationToken)
        {
            CreatePatientCommandValidator validationRule = new CreatePatientCommandValidator();
            var validator = validationRule.Validate(request);
            if (!validator.IsValid)
            {
                var errorsResult = new List<string>();
                foreach (var error in validator.Errors)
                {
                    errorsResult.Add(error.ErrorMessage);
                }
                throw new ValidationException(errorsResult.ToString());
            }
            var product = mapper.Map<Patient>(request);
            return await repository.AddPatientAsync(product);
        }
    }
}
