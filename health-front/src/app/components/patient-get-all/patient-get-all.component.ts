import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient/patient.service';
import { AuthService } from '../../services/auth/auth.service';
import {RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-get-all',
  templateUrl: './patient-get-all.component.html',
  styleUrl: './patient-get-all.component.css',
  imports: [
    CommonModule,
    RouterLink
  ],
  standalone: true
})
export class PatientGetAllComponent implements OnInit {
  patients: any[] = [];
  page = 1;
  size = 10;

  constructor(private patientService: PatientService, private authService: AuthService) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    if (this.authService.isAuthenticated() && this.authService.getUserRole() !== 'Patient') {
      const headers = this.authService.getAuthHeaders();
      this.patientService.getAllPatients(this.page, this.size, { headers }).subscribe({
        next: (data) => (this.patients = data.items || []),
        error: (err) => console.error(err),
      });
    }
  }

  deletePatient(id: string) {
    if (confirm('Are you sure you want to delete this patient?')) {
      const headers = this.authService.getAuthHeaders();
      this.patientService.deletePatient(id, { headers }).subscribe({
        next: () => {
          alert('Patient deleted successfully');
          this.loadPatients();
        },
        error: (err) => console.error(err),
      });
    }
  }
}
