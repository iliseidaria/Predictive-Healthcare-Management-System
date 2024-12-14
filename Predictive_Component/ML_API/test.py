import pytest
from fastapi.testclient import TestClient
from main import app

# Initialize the TestClient for the FastAPI app
client = TestClient(app)

# Test the root endpoint
def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}

# Test the /hello/{name} endpoint
def test_hello():
    name = "John"
    response = client.get(f"/hello/{name}")
    assert response.status_code == 200
    assert response.json() == {"message": f"Hello {name}"}

# Test the /predict endpoint with valid input
def test_predict_valid():
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
    response = client.post("/predict", json=patient_data)
    assert response.status_code == 200
    predictions = response.json().get("predictions")
    assert predictions is not None
    assert isinstance(predictions, dict)
    # Additional checks for likelihood values
    for disease, likelihood in predictions.items():
        assert 0 <= likelihood <= 1  # Ensure the likelihood is a valid probability

# Test the /predict endpoint with incomplete data
def test_predict_incomplete():
    patient_data = {
        "patient_id": "f623bb9f-6e4b-409f-8a6e-c8469391bffb",
        "first_name": "John",
        "last_name": "Doe",
        # Missing date_of_birth, gender, etc.
        "medical_history": []
    }
    response = client.post("/predict", json=patient_data)
    assert response.status_code == 422  # Validation should fail

# Test /predict with empty JSON
def test_predict_empty():
    response = client.post("/predict", json={})
    assert response.status_code == 422  # Validation should fail due to missing required fields

# Test /predict with non-JSON input
def test_predict_non_json():
    response = client.post("/predict", data="Not a JSON")
    assert response.status_code == 422  # FastAPI should reject invalid input
