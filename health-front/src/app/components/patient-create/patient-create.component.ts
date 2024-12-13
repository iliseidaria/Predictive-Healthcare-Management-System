import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient/patient.service';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

function toUTC(date: string): string {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid Date:', date);
    return '';
  }
  return dateObj.toISOString().split('T')[0];
}

@Component({
  selector: 'app-patient-create',
  templateUrl: './patient-create.component.html',
  styleUrl: './patient-create.component.css',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
})
export class PatientCreateComponent {
  patientForm: FormGroup;
  router: any;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private authService: AuthService
  ) {
    this.patientForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      gender: [0, [Validators.required]],
      contactInformation: ['', [Validators.required]],
      address: ['', Validators.required],
      photoPath: [''],
    });
  }

  onSubmit() {
    if (this.authService.isAuthenticated() && this.authService.getUserRole() !== 'Patient') {
      if (this.patientForm.valid) {
        const formData = {
          ...this.patientForm.value,
          dateOfBirth: toUTC(this.patientForm.value.dateOfBirth),
        };

        console.log('Form Data Sent:', formData);
        const headers = this.authService.getAuthHeaders();
        this.patientService.createPatient(formData, { headers }).subscribe({
          next: () => {
            alert('Patient created successfully!');
            this.router.navigateByUrl('/get-all-patients');
          },
          error: (err) => console.error('Error:', err),
        });
      } else {
        console.error('Form is invalid:', this.patientForm);
      }
    } else {
      console.error('Unauthorized or insufficient permissions');
    }
  }
}
