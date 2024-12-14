from pydantic import BaseModel
from typing import List
from enum import Enum
from uuid import UUID
from datetime import date

class GenderEnum(str, Enum):
    Male = "Male"
    Female = "Female"
    Other = "Other"

def GenderToStr(EnumValue):
  return 'Male' if EnumValue == GenderEnum.Male else 'Female' if EnumValue == GenderEnum.Female else 'Other'

class Prescription(BaseModel):
    prescription_id: UUID
    medication_name: str
    dosage: str
    duration: str

class MedicalRecord(BaseModel):
    record_id: UUID
    patient_id: UUID
    date: date
    diagnosis: str
    notes: str
    prescriptions: List[Prescription]

class Patient(BaseModel):
    patient_id: UUID
    first_name: str
    last_name: str
    date_of_birth: date
    gender: GenderEnum
    contact_information: str
    address: str
    photo_path: str
    medical_history: List[MedicalRecord]
    appointments: List[dict]
