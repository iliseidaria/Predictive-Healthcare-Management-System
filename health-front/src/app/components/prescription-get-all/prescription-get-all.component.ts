import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriptionService } from '../../services/prescription/prescription.service';
import { AuthService } from '../../services/auth/auth.service';
import { Prescription } from '../../models/prescription';
import { Router, RouterModule } from '@angular/router';
import { PatientService } from '../../services/patient/patient.service';
import { forkJoin } from 'rxjs';
import { NavigationService } from '../../services/navigation/navigation.service';

@Component({
  selector: 'app-prescription-get-all',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './prescription-get-all.component.html',
  styleUrl: './prescription-get-all.component.css'
})
export class PrescriptionGetAllComponent implements OnInit {
  prescriptions: (Prescription & { patientName?: string })[] = [];
  patientNames: Map<string, string> = new Map();
  loading = false;
  error: string | null = null;
  page = 1;
  size = 10;
  totalCount = 0;
  private navigationService = inject(NavigationService);

  constructor(
    private prescriptionService: PrescriptionService,
    private authService: AuthService,
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPrescriptions();
  }

  loadPrescriptions(): void {
    if (!this.authService.validateToken()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.prescriptionService.getAllPrescriptions(
      this.page,
      this.size,
      { headers: this.authService.getAuthHeaders() }
    ).subscribe({
      next: (response) => {
        this.prescriptions = response.items;
        this.totalCount = response.totalCount;
        this.loadPatientNames();
      },
      error: (error) => {
        this.error = 'Error loading prescriptions';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  loadPatientNames(): void {
    const uniquePatientIds = [...new Set(this.prescriptions.map(p => p.patientId))];
    
    const patientRequests = uniquePatientIds.map(id => 
      this.patientService.getPatientById(id, { headers: this.authService.getAuthHeaders() })
    );

    forkJoin(patientRequests).subscribe({
      next: (patients) => {
        patients.forEach((patient, index) => {
          const patientId = uniquePatientIds[index];
          const fullName = `${patient.firstName} ${patient.lastName}`;
          this.patientNames.set(patientId, fullName);
        });
        this.prescriptions = this.prescriptions.map(prescription => ({
          ...prescription,
          patientName: this.patientNames.get(prescription.patientId)
        }));
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading patient names';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  deletePrescription(id: string) {
    if (confirm('Are you sure you want to delete this prescription?')) {
      const headers = this.authService.getAuthHeaders();
      this.prescriptionService.deletePrescription(id, { headers }).subscribe({
        next: () => {
          alert('Prescription deleted successfully');
          this.loadPrescriptions();
        },
        error: (err) => console.error(err),
      });
    }
  }

  nextPage(): void {
    if (!this.isLastPage()) {
      this.page++;
      this.loadPrescriptions();
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadPrescriptions();
    }
  }

  isLastPage(): boolean {
    return this.page * this.size >= this.totalCount;
  }

  goBack(): void {
    this.navigationService.goBack();
  }
}