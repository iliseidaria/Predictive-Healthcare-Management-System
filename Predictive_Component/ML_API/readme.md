# FastAPI Prediction API

This FastAPI-based web application predicts diseases based on patient data. It accepts JSON input with detailed patient records and returns likelihoods for various diseases using a prediction model.

---

## Features

- **Root Endpoint (`/`)**: Returns a simple "Hello World" message.
- **Hello Endpoint (`/hello/{name}`)**: Returns a personalized greeting.
- **Prediction Endpoint (`/predict`)**: Accepts a JSON payload with patient details and returns the predicted likelihood of diseases.

---

## Installation

1. **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd <repository-folder>/Predictive_Component/ML_API
    ```

2. **Create a Virtual Environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate   # On Windows: venv\Scripts\activate
    ```

3. **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4. **Ensure Data File Exists:**
   - The `Disease_symptom_and_patient_profile_dataset.csv` file must be in the root directory.

---

## Running the Application

Start the FastAPI server on port `8000`:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
---
## How does the predictor work?
Using the given dataset (https://www.kaggle.com/datasets/uom190346a/disease-symptoms-and-patient-profile-dataset), the predictor runs a Naive-Bayes Classifier using the probabilities from the training data. We chose a Naive-Bayes so that the computation is done easier, although it is clear that a Joint-Bayes Classifier would work better. 

