import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient/patient.service';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService } from '../../services/navigation/navigation.service';

export function toUTC(date: string): string {
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
  providers: [PatientService, NavigationService],
  viewProviders: []
})
export class PatientCreateComponent {
  patientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private authService: AuthService,
    private router: Router,
    private navigationService: NavigationService  ) {
      this.patientForm = this.fb.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        dateOfBirth: ['', [Validators.required]],
        gender: [0, [Validators.required]],
        contactInformation: ['', [Validators.required]],
        address: ['', Validators.required],
        photoPath: [''],
  });}

  onSubmit() {
    if (this.authService.validateToken() && this.authService.getCurrentUser().role !== 'Patient') {
      if (this.patientForm.valid) {
        const formData = {
          ...this.patientForm.value,
          gender: parseInt(this.patientForm.value.gender, 10),
          dateOfBirth: toUTC(this.patientForm.value.dateOfBirth),
        };

        console.log('Form Data Sent:', formData);
        const headers = this.authService.getAuthHeaders();
        this.patientService.createPatient(formData, { headers }).subscribe({
          next: (response) => {
            alert('Patient created successfully!');
            console.log('Response ID:', response.id);
            this.router.navigateByUrl(`/patient-detail/${response.id}`);
          },
          error: (err) => {
            console.error('Error in create:', err);
            alert('Error creating patient');
          },
          complete: () => {
            console.log('Create operation completed');
          }
        });
      } else {
        console.error('Form is invalid:', this.patientForm);
      }
    } else {
      console.error('Unauthorized or insufficient permissions');
      alert('You do not have permission to create a patient');
      this.router.navigate(['/login']); //ar trebui si sters tokenul cred
    }
  }

  goBack(): void {
    this.navigationService.goBack();
  }
}