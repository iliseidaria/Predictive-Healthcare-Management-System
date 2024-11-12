# Predictive Healthcare Management System

**Contributors**: Boboc Alexia, Ilisei Daria, Petrescu Eden, Pîntea Andreea, Romanescu Adia

---

## 1. Patient Management Overview

The Patient Management feature is fundamental to the system, handling CRUD operations for patient information. These operations are accessible via RESTful APIs and are designed with validation, error handling, and consistency.

---

## 2. Entities and Domain Model

### Patient Entity
The **Patient** entity models core patient data:
- **PatientId (Guid)**: Unique identifier for each patient.
- **FirstName and LastName (string)**: Patient’s name fields.
- **DateOfBirth (DateTime)**: Date of birth used to calculate age and assess health risks.
- **Gender (enum)**: Represents the patient’s gender.
- **ContactInformation (string)**: Contact details such as phone or email.
- **Address (string)**: Residential address.

**Goal**: Efficiently structure patient data to support predictive health risk models.

---

### Appointment Entity
The **Appointment** entity models the scheduling and tracking of patient appointments:
- **AppointmentId (Guid)**: Unique identifier for each appointment.
- **PatientId (Guid)**: Links the appointment to a specific patient.
- **ProviderId (Guid)**: Identifier for the healthcare provider handling the appointment.
- **AppointmentDate (DateTime)**: Date and time scheduled for the appointment.
- **Reason (string)**: Description of the reason for the appointment.
- **Status (AppointmentStatus enum)**: Indicates the status of the appointment (e.g., Scheduled, Completed, or Cancelled).

**Goal**: Facilitate efficient scheduling and management of appointments, with clear tracking of each appointment’s purpose and current status.

---

### MedicalRecord Entity
The **MedicalRecord** entity organizes comprehensive health data for each patient visit:
- **RecordId (Guid)**: Unique identifier for each medical record entry.
- **PatientId (Guid)**: Links the record to the associated patient.
- **Date (DateTime)**: Date when the medical record was created or updated.
- **Diagnosis (string)**: The diagnosis made by the healthcare provider.
- **Prescriptions (List<Prescription>)**: List of prescribed medications associated with this record.
- **Notes (string)**: Additional observations or comments from the healthcare provider.

**Goal**: Maintain a detailed and organised history of medical assessments, enabling effective tracking of patient health over time.

---

### Prediction Entity
The **Prediction** entity models data related to predictive health assessments:
- **PredictionId (Guid)**: Unique identifier for each prediction entry.
- **PatientId (Guid)**: Links the prediction to the relevant patient.
- **Date (DateTime)**: Date when the prediction was made.
- **RiskScore (float)**: Numeric score representing the calculated health risk level.
- **RiskFactors (string)**: Description of the factors contributing to the risk assessment.
- **Recommendation (string)**: Suggested actions or interventions based on the prediction.

**Goal**: Provide actionable insights on potential health risks, supporting proactive care strategies.

---

### Prescription Entity
The **Prescription** entity models prescribed medications for patient treatment:
- **PrescriptionId (Guid)**: Unique identifier for each prescription.
- **RecordId (Guid)**: Links the prescription to a specific medical record.
- **MedicationName (string)**: Name of the prescribed medication.
- **Dosage (string)**: Recommended dosage of the medication.
- **Frequency (string)**: Frequency at which the medication should be taken.
- **Duration (int)**: Duration (in days) for which the prescription is valid.

**Goal**: Ensure structured management of prescribed treatments to promote adherence and support effective care.

---

### Domain Model Overview
The domain model is represented using a Level 2 C4 diagram:
https://s.icepanel.io/kfVxScaCFTOU3F/sJJo

---

## 3. Feature-Specific Use Cases

### 3.1 Patient Queries

#### 3.1.A Get All Patients (Query)
- **Purpose**: Retrieve a list of all patients in the system.
- **Input**: No input parameters.
- **Output**: A list of `PatientDto` objects, each containing patient data.
- **Handler**: `GetAllPatientsQueryHandler`
- **Data Flow**:
  - The API receives a `GET /api/patients` request.
  - `GetAllPatientsQueryHandler` fetches patient data from the repository.
  - Data is returned to the client in a structured list format.

#### 3.1.B Create Patient (Command)
- **Purpose**: Add a new patient to the system.
- **Input**: Fields include `FirstName`, `LastName`, `DateOfBirth`, `Gender`, `ContactInformation`, and `Address`.
- **Output**: The newly created patient’s data as a `PatientDto`.
- **Handler**: `CreatePatientCommandHandler`
- **Validation**:
  - `CreatePatientValidator` enforces rules such as:
    - `FirstName` and `LastName` must be non-empty.
    - `DateOfBirth` must be a past date.
- **Data Flow**:
  - The API receives a `POST /api/patients` request with patient details.
  - The `ValidationBehavior` pipeline validates the data.
  - If valid, `CreatePatientCommandHandler` adds the patient to the repository.
  - Returns a success result with patient data; on failure, returns an error message.

#### 3.1.C Update Patient (Command)
- **Purpose**: Update existing patient data.
- **Input**: Fields include `PatientId`, `FirstName`, `LastName`, `DateOfBirth`, `Gender`, `ContactInformation`, and `Address`.
- **Output**: Updated patient data as a `PatientDto`.
- **Handler**: `UpdatePatientCommandHandler`
- **Validation**:
  - `UpdatePatientValidator` checks:
    - `PatientId` must not be empty.
    - `FirstName` and `LastName` must be non-empty.
    - `DateOfBirth` must be a past date.
- **Data Flow**:
  - The API receives a `PUT /api/patients/{id}` request.
  - The `ValidationBehavior` pipeline validates data.
  - If valid, `UpdatePatientCommandHandler` updates the record in the repository.
  - Returns a success result with updated data; on failure, provides an error message.

### 3.2 Medical Record Management

- **Get All Medical Records (Query)**: Retrieves all medical records.
- **Create Medical Record (Command)**: Adds a new medical record.
- **Update Medical Record (Command)**: Updates existing medical record data.
- **Delete Medical Record (Command)**: Removes a medical record.

---

## 4. Architecture Patterns

### 4.1 CQRS (Command Query Responsibility Segregation)
The CQRS pattern divides commands (create/update) and queries (get) into separate handlers:
- **Commands**: Handle state changes (e.g., creating or updating patient data).
- **Queries**: Handle data retrieval (e.g., fetching all patients).

### 4.2 MediatR for Request Handling
`MediatR` acts as an intermediary between API calls and application logic, decoupling controllers from specific implementations:
- Each command and query is defined as a Request handled by a specific handler.
- The `ValidationBehavior` is configured as a pipeline within MediatR, ensuring validation for each request.

### 4.3 Result Pattern
The Result Pattern provides a unified response structure for commands, helping to distinguish between:
- **Success** responses, which include the requested data.
- **Failure** responses, which contain error messages indicating validation issues or operational failures.

---

## 5. Validation Pipeline and Error Handling

### 5.1 Validation Pipeline
The `ValidationBehavior` pipeline is a MediatR middleware that performs validation using FluentValidation before any command or query reaches the handler:
- If validation fails, it intercepts the request and returns a structured error message.
- This approach keeps validation logic centralized and consistent across the application.

### 5.2 Fluent Validation for Create and Update
Validators ensure data integrity and improve user experience by catching common data issues before they reach the business logic:
- `CreatePatientValidator`: Ensures fields like `FirstName`, `LastName`, `ContactInformation`, and `DateOfBirth` are populated and valid.
- `UpdatePatientValidator`: Ensures the `PatientId` is provided and matches the request, along with other required fields.

---

## 6. API Endpoints
### AppointmentController Endpoints
- **GET /api/v1/Appointment**: Retrieves a list of all appointments.
- **POST /api/v1/Appointment**: Creates a new appointment.
- **GET /api/v1/Appointment/{id}**: Retrieves details of a specific appointment by its ID.
- **PUT /api/v1/Appointment/{id}**: Updates an existing appointment.
- **DELETE /api/v1/Appointment/{id}**: Deletes a specific appointment by its ID.

### PatientController Endpoints
- **GET /api/patients**: Retrieves a list of all patients.
- **POST /api/patients**: Creates a new patient record.
- **PUT /api/patients/{id}**: Updates an existing patient record.

### MedicalRecordController Endpoints
- **GET /api/medicalrecords**: Retrieves a list of all medical records.
- **POST /api/medicalrecords**: Creates a new medical record.
- **PUT /api/medicalrecords/{id}**: Updates an existing medical record.
- **DELETE /api/medicalrecords/{id}**: Deletes a medical record.

---

## 7. Error Handling

### 7.1 Development Error Handling
- **Route**: `/error-development`
- **Details**: Provides detailed stack trace if errors occur during development.

### 7.2 Production Error Handling
- **Route**: `/error`
- **Details**: Presents generalized error information for production environments.

---

## 8. Sample Error and Success Responses

### Success Response for Create and Update Operations
```json
{
  "isSuccess": true,
  "value": {
   

 "patientId": "e2e5f3b4-1234-5678-90ab-12345678abcd",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "gender": "Male",
    "contactInformation": "123-456-7890",
    "address": "123 Main St"
  },
  "error": null
}
```

### Failure Response for Create (Validation Error)
```json
{
  "isSuccess": false,
  "value": null,
  "error": "First name is required; Date of birth must be in the past."
}
```

---

## 9. Next Steps
- Implement additional features for **Appointment**, **Prediction**, and **Prescription** management.
- Further refine the **error-handling** and **validation** pipelines.
- Explore advanced **prediction algorithms** based on patient history and external factors.

