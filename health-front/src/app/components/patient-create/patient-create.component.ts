import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../../app/services/patient.service';

function toUTC(date: string): string {
  const dateObj = new Date(date);
  return new Date(Date.UTC(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
    dateObj.getHours(),
    dateObj.getMinutes(),
    dateObj.getSeconds()
  )).toISOString();
}

@Component({
  selector: 'app-patient-create',
  templateUrl: './patient-create.component.html',
  imports: [ReactiveFormsModule],
  standalone: true,
})
export class PatientCreateComponent {
  patientForm: FormGroup;

  constructor(private fb: FormBuilder, private patientService: PatientService) {
    this.patientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: [0, Validators.required],
      contactInformation: ['', Validators.required],
      address: ['', Validators.required],
      photoPath: [''],
    });
  }

  onSubmit() {
    if (this.patientForm.valid) {
      const formData = {
        ...this.patientForm.value,
        dateOfBirth: toUTC(this.patientForm.value.dateOfBirth), // Conversie în UTC
      };
  
      console.log('Form Data Sent:', formData);
      this.patientService.createPatient(formData).subscribe({
        next: () => alert('Patient created successfully!'),
        error: (err) => console.error('Error:', err),
      });
    } else {
      console.error('Form is invalid:', this.patientForm);
    }
  }
  
}
