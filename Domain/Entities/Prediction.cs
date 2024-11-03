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
