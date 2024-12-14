from http.client import HTTPException

from fastapi import FastAPI

from calculator import get_answer
from classes import Patient


app = FastAPI()
@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
'''
GET /patient_test

json with patient features
returns prediction data for diseases with more than 10% likelihood
'''


@app.post("/predict")
async def predict(patient_data: Patient):
  try:
    # Convert the Pydantic model to a dictionary
    patient_dict = patient_data.dict()

    # Get prediction from the get_answer function
    predictions = get_answer(patient_dict)

    # Return predictions as JSON
    return {"predictions": predictions}
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
