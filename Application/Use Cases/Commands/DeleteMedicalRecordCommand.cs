using MediatR;

namespace Application.Use_Cases.Commands
{
    public class DeleteMedicalRecordCommand : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }
}
