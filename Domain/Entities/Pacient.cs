using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
   public class Patient
    {
        public Guid PatientId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string ContactInformation { get; set; }
        public string Address { get; set; }
        public List<MedicalRecord> MedicalHistory { get; set; } = new List<MedicalRecord>();
        public List<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}
