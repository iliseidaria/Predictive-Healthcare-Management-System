import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../services/patient/patient.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-update',
  styleUrl: './patient-update.component.css',
  templateUrl: './patient-update.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class PatientUpdateComponent implements OnInit {
  patientForm: FormGroup;
  patientId!: string;

  constructor(
    private route: ActivatedRoute, //ar trebui pus Router
    private fb: FormBuilder,
    private patientService: PatientService
  ) {
    this.patientForm = this.fb.group({
      patientId: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: [Date(), Validators.required],  // Default as null, we will handle the date object
      gender: [0, Validators.required],
      contactInformation: ['', Validators.required],
      address: ['', Validators.required],
      photoPath: [''],
    });
  }

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id')!;
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (patient) => {
        // Ensure dateOfBirth is a Date object when setting the form value
        if (patient.dateOfBirth) {
          patient.dateOfBirth = new Date(patient.dateOfBirth); // Convert to Date object
        }
        patient.gender= parseInt(patient.gender, 10)
        this.patientForm.patchValue(patient);
        console.log('Loaded Patient:', patient);
      },
      error: (err) => console.error('Error loading patient:', err),
    });
  }

  onSubmit() {
    if (this.patientForm.valid) {
      const formValue = this.patientForm.value;
      formValue.gender=parseInt(formValue.gender, 10);

      // Ensure the dateOfBirth is a Date object before sending to the backend
      if (formValue.dateOfBirth instanceof Date) {
        // Convert date to UTC if it's not already
        formValue.dateOfBirth = new Date(formValue.dateOfBirth.toISOString()); // Convert to UTC
      }
      else if (typeof formValue.dateOfBirth === 'string') {
        formValue.dateOfBirth = new Date(formValue.dateOfBirth); // Convert to Date object
        formValue.dateOfBirth = new Date(formValue.dateOfBirth.toISOString()); // Convert to UTC
      }
      this.patientService
        .updatePatient(this.patientId, formValue)
        .subscribe({
          next: () => alert('Patient updated successfully!'),
          error: (err) => console.error('Error updating patient:', err),
        });
    }
  }
}
