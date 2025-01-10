import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PrescriptionService } from '../../services/prescription/prescription.service';
import { AuthService } from '../../services/auth/auth.service';
import { PatientService } from '../../services/patient/patient.service';
import { NavigationService } from '../../services/navigation/navigation.service';
import { toUTC } from '../patient-create/patient-create.component';

// interface Patient {
//   id: string;
//   firstName: string;
//   lastName: string;
// }

@Component({
  selector: 'app-prescription-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './prescription-create.component.html',
  styleUrl: './prescription-create.component.css'
})
export class PrescriptionCreateComponent implements OnInit {
  prescriptionForm: FormGroup;
  // patients: Patient[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService,
    private patientService: PatientService,
    private authService: AuthService,
    private navigationService: NavigationService
  ) {
    this.prescriptionForm = this.fb.group({
      patientId: [null, Validators.required],
      medicationName: ['', Validators.required],
      dosage: ['', Validators.required],
      frequency: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      notes: ['']
    });

    this.prescriptionForm.get('patientId')?.valueChanges.subscribe(value => {
      console.log('Patient ID changed:', value);
    });
  }

  ngOnInit(): void {
    // this.loadPatients();
  }

  // loadPatients(): void {
  //   this.patientService.getAllPatients(1, 100, { 
  //     headers: this.authService.getAuthHeaders() 
  //   }).subscribe({
  //     next: (response) => this.patients = response.items,
  //     error: (error) => this.error = 'Error loading patients'
  //   });
  // }
  // loadPatients(): void {
  //   this.patientService.getAllPatients(1, 100, { 
  //     headers: this.authService.getAuthHeaders() 
  //   }).subscribe({
  //     next: (response) => {
  //       this.patients = response.items.map((patient: { id: string; firstName: string; lastName: string; }) => ({
  //         id: patient.id,
  //         firstName: patient.firstName,
  //         lastName: patient.lastName
  //       }));
  //     },
  //     error: (error) => this.error = 'Error loading patients'
  //   });
  // }
  // loadPatients(): void {
  //   this.patientService.getAllPatients(1, 100, { 
  //     headers: this.authService.getAuthHeaders() 
  //   }).subscribe({
  //     next: (response) => {
  //       this.patients = response.items.map((patient: { id: string; firstName: string; lastName: string; }) => ({
  //         id: patient.id,
  //         firstName: patient.firstName,
  //         lastName: patient.lastName
  //       }));
  //       console.log('Mapped patients:', this.patients);
  //     },
  //     error: (error) => this.error = 'Error loading patients'
  //   });
  // }

  // onPatientSelect(event: any): void {
  //   console.log('Selected patient value:', event.target.value);
  //   this.prescriptionForm.patchValue({
  //     patientId: event.target.value
  //   });
  // }

  onSubmit(): void {
    if (this.prescriptionForm.valid) {
      this.loading = true;
      const formData = this.prescriptionForm.getRawValue();
      
      const prescriptionData = {
        patientId: formData.patientId,
        medicationName: formData.medicationName,
        dosage: formData.dosage,
        frequency: formData.frequency,
        startDate: toUTC(formData.startDate),
        endDate: toUTC(formData.endDate),
        notes: formData.notes || ''
      };

      console.log('Submitting prescription:', prescriptionData); // Debug log

      this.prescriptionService.createPrescription(
        prescriptionData,
        { headers: this.authService.getAuthHeaders() }
      ).subscribe({
        next: () => this.navigationService.goBack(),
        error: (error) => {
          console.error('Creation Error:', error);
          this.error = 'Error creating prescription';
          this.loading = false;
        }
      });
    } else {
      console.log('Form invalid:', this.prescriptionForm.errors);
    }
  }

  goBack(): void {
    this.navigationService.goBack();
  }
}