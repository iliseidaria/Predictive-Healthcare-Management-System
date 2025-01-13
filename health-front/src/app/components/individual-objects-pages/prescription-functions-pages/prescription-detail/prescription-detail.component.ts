import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PrescriptionService } from '../../../../services/prescription/prescription.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { PatientService } from '../../../../services/patient/patient.service';
import { Prescription } from '../../../../models/prescription';
import { NavigationService } from '../../../../services/navigation/navigation.service';

@Component({
  selector: 'app-prescription-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prescription-detail.component.html',
  styleUrl: './prescription-detail.component.css'
})
export class PrescriptionDetailComponent implements OnInit {
  prescription: Prescription | null = null;
  patientName: string = '';
  loading = true;
  error: string | null = null;
  private navigationService = inject(NavigationService);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prescriptionService: PrescriptionService,
    private patientService: PatientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPrescription(id);
    } else {
      this.error = 'No prescription ID provided';
      this.loading = false;
    }
  }

  loadPrescription(id: string): void {
    const headers = this.authService.getAuthHeaders();
    this.prescriptionService.getPrescriptionById(id, { headers }).subscribe({
      next: (prescription) => {
        this.prescription = prescription;
        this.loadPatientName(prescription.patientId);
      },
      error: (error) => {
        this.error = 'Error loading prescription';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  loadPatientName(patientId: string): void {
    const headers = this.authService.getAuthHeaders();
    this.patientService.getPatientById(patientId, { headers }).subscribe({
      next: (patient) => {
        this.patientName = `${patient.firstName} ${patient.lastName}`;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading patient details';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  goBack(): void {
    this.navigationService.goBack();
  }
}
