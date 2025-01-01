import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientService } from '../../services/patient/patient.service';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigation/navigation.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css'],
  standalone: true,
  imports: [CommonModule],
  providers: [NavigationService]
})
export class PatientDetailComponent implements OnInit {
  patient: any;
  predictions: Record<string, number> | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private navigationService: NavigationService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const patientId = params.get('id');
      console.log('Patient ID from URL:', patientId);
      if (patientId) {
        this.loadPatient(patientId);
      }
    });
  }

  loadPatient(id: string): void {
    if (this.authService.validateToken()) {
      const headers = this.authService.getAuthHeaders();
      console.log('Calling endpoint with ID:', id);
      this.patientService.getPatientById(id, { headers }).subscribe({
        next: (data) => {
          this.patient = data;
          console.log('Patient Details:', this.patient);
          this.fetchPredictions();
        },
        error: (err) => console.error('Error loading patient:', err),
      });
    }
  }
  fetchPredictions(): void {
    // Construct the exact patient JSON payload
    const patientData = {
      patient_id: this.patient.patientId || "f623bb9f-6e4b-409f-8a6e-c8469391bffb",
      first_name: this.patient.firstName || "John",
      last_name: this.patient.lastName || "Doe",
      date_of_birth: this.patient.dateOfBirth || "1980-05-12",
      gender: this.patient.gender || "Male",
      contact_information: this.patient.contactInformation || "555-1234",
      address: this.patient.address || "123 Main St",
      photo_path: this.patient.photoPath || "/path/to/photo.jpg",
      medical_history: this.patient.medicalHistory?.map((record: any) => ({
        record_id: record.recordId || "bfedb973-2b44-473d-9d4c-87c431fce11b",
        patient_id: record.patientId || "f623bb9f-6e4b-409f-8a6e-c8469391bffb",
        date: record.date || "2024-11-10",
        diagnosis: record.diagnosis || "Diabetes and High Blood Pressure",
        notes: record.notes || "Patient has been showing signs of fatigue and high cholesterol.",
        prescriptions: record.prescriptions?.map((prescription: any) => ({
          prescription_id: prescription.prescriptionId || "d5482f5e-4d42-4f34-a07a-5d64b31f9f2b",
          medication_name: prescription.medicationName || "Metformin",
          dosage: prescription.dosage || "500 mg",
          duration: prescription.duration || "30 days",
        })) || [],
      })) || [],
      appointments: this.patient.appointments || [],
    };

    // Send POST request
    this.http.post<any>('http://localhost:8000/predict', patientData, {
      headers: { 'Content-Type': 'application/json' },
    }).subscribe({
      next: (response) => {
        this.predictions = response.predictions;
        console.log('Predictions:', this.predictions);
      },
      error: (err) => console.error('Error fetching predictions:', err),
    });
  }


  calculateAge(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getGender(gender: number): string {
    return gender === 0 ? 'Male' : gender === 1 ? 'Female' : 'Other';
  }

  formatPredictions(predictions: Record<string, number>): string {
    return Object.entries(predictions)
      .filter(([_, likelihood]) => likelihood > 0.04)
      .map(([disease, likelihood]) => `${disease} (${(likelihood * 100).toFixed(2)}%)`)
      .join(', ') || 'No significant predictions';
  }

  goBack(): void {
    this.navigationService.goBack();
  }
}
