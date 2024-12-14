from datetime import datetime

from calculator import get_answer

# Features to process
YesNoFeatures = ['Fever', 'Cough', 'Fatigue', 'Difficulty Breathing']
OrdinalFeatures = ['Blood Pressure', 'Cholesterol Level']

def extract_patient_features(patient_data):
    """
    Extracts relevant features for prediction from the patient's JSON data.
    """
    feature_map = {}

    # Calculate age from date_of_birth
    date_of_birth = datetime.strptime(patient_data['date_of_birth'], '%Y-%m-%d')
    current_date = datetime.now()
    age = current_date.year - date_of_birth.year - ((current_date.month, current_date.day) < (date_of_birth.month, date_of_birth.day))
    feature_map['Age'] = age

    # Map gender directly
    feature_map['Gender'] = patient_data['gender']

    # Initialize Yes/No features with 'No'
    for feature in YesNoFeatures:
        feature_map[feature] = 'No'

    # Initialize Ordinal features with 'Normal'
    for feature in OrdinalFeatures:
        feature_map[feature] = 'Normal'

    # Extract features from medical history
    for record in patient_data.get('medical_history', []):
        # Check in diagnosis and notes for feature keywords
        diagnosis = record.get('diagnosis', '').lower()
        notes = record.get('notes', '').lower()

        # Process Yes/No features
        for feature in YesNoFeatures:
            if feature.lower() in diagnosis or feature.lower() in notes:
                feature_map[feature] = 'Yes'

        # Process Ordinal features
        if 'blood pressure' in diagnosis or 'blood pressure' in notes:
            if 'high' in diagnosis or 'high' in notes:
                feature_map['Blood Pressure'] = 'High'
            elif 'low' in diagnosis or 'low' in notes:
                feature_map['Blood Pressure'] = 'Low'
        if 'cholesterol' in diagnosis or 'cholesterol' in notes:
            if 'high' in diagnosis or 'high' in notes:
                feature_map['Cholesterol Level'] = 'High'
            elif 'low' in diagnosis or 'low' in notes:
                feature_map['Cholesterol Level'] = 'Low'

    return feature_map

# Example usage
patient_data = {
    "patient_id": "f623bb9f-6e4b-409f-8a6e-c8469391bffb",
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "1980-05-12",
    "gender": "Male",
    "contact_information": "555-1234",
    "address": "123 Main St",
    "photo_path": "/path/to/photo.jpg",
    "medical_history": [
        {
            "record_id": "bfedb973-2b44-473d-9d4c-87c431fce11b",
            "patient_id": "f623bb9f-6e4b-409f-8a6e-c8469391bffb",
            "date": "2024-11-10",
            "diagnosis": "Diabetes and High Blood Pressure",
            "notes": "Patient has been showing signs of fatigue and high cholesterol.",
            "prescriptions": [
                {
                    "prescription_id": "d5482f5e-4d42-4f34-a07a-5d64b31f9f2b",
                    "medication_name": "Metformin",
                    "dosage": "500 mg",
                    "duration": "30 days"
                }
            ]
        }
    ],
    "appointments": []
}

features = extract_patient_features(patient_data)
print(get_answer(features))
