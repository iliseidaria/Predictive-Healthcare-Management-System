from fastapi import FastAPI, HTTPException
from calculator import get_answer
from classes import Patient
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/predict")
async def predict(patient_data: Patient):
    try:
        # Convert patient data to dictionary
        patient_dict = patient_data.dict()

        # Call the prediction function
        predictions = get_answer(patient_dict)

        # Ensure proper response format
        return {"predictions": predictions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
