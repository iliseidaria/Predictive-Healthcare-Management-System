using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Prediction
    {
        public Guid PredictionId { get; set; }
        public Guid PatientId { get; set; }
        public DateTime Date { get; set; }
        public float RiskScore { get; set; }
        public string RiskFactors { get; set; }
        public string Recommendation { get; set; }
    }
}
