import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class PatientDetailComponent implements OnInit {
  patient: any;

  constructor(private route: ActivatedRoute, private patientService: PatientService) {}

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('id');
    if (patientId) {
      this.loadPatient(patientId);
    }
  }

  loadPatient(id: string): void {
    this.patientService.getPatientById(id).subscribe({
      next: (data) => {
        this.patient = data;
        console.log('Patient Details:', this.patient);
      },
      error: (err) => console.error('Error loading patient:', err),
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
}