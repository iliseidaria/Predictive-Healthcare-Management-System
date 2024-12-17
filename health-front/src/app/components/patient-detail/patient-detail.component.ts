import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientService } from '../../services/patient/patient.service';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigation/navigation.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.css',
  standalone: true,
  imports: [CommonModule],
  providers: [NavigationService]
})
export class PatientDetailComponent implements OnInit {
  patient: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private navigationService: NavigationService,
    private authService: AuthService
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
    if (this.authService.isAuthenticated()) {
      const headers = this.authService.getAuthHeaders();
      console.log('Calling endpoint with ID:', id);
      this.patientService.getPatientById(id, { headers }).subscribe({
        next: (data) => {
          this.patient = data;
          console.log('Patient Details:', this.patient);
        },
        error: (err) => console.error('Error loading patient:', err),
      });
    }
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

  goBack(): void {
    this.navigationService.goBack();
  }
}