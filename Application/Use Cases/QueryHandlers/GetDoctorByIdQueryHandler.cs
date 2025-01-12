using Application.DTOs;
using Application.Use_Cases.Queries;
using Infrastructure.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Use_Cases.QueryHandlers
{
  public class GetDoctorByIdQueryHandler : IRequestHandler<GetDoctorByIdQuery, bool>
  {
    private readonly ApplicationDbContext _context;
    public GetDoctorByIdQueryHandler(ApplicationDbContext context)
    {
      _context = context;
    }
    public async Task<bool> Handle(GetDoctorByIdQuery request, CancellationToken cancellationToken)
    {
      var doctorExists = await _context.DoctorIds
          .AnyAsync(d => d.Id.ToString() == request.DoctorId, cancellationToken);

      return doctorExists;
    }
  }
}
