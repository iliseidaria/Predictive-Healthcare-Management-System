using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
  public class AddPrescriptionCommandHandler : IRequestHandler<AddPrescriptionCommand, Guid>
  {
    private readonly IPrescriptionRepository _repository;
    private readonly IMapper _mapper;

    public AddPrescriptionCommandHandler(IPrescriptionRepository repository, IMapper mapper)
    {
      _repository = repository;
      _mapper = mapper;
    }

    public async Task<Guid> Handle(AddPrescriptionCommand request, CancellationToken cancellationToken)
    {
      var prescription = _mapper.Map<Prescription>(request);
      return await _repository.AddPrescriptionAsync(prescription);
    }
  }
}

