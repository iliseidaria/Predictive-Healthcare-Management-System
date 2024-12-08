import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-update',
  templateUrl: './patient-update.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class PatientUpdateComponent implements OnInit {
  patientForm: FormGroup;
  patientId!: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private patientService: PatientService
  ) {
    this.patientForm = this.fb.group({
      patientId: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      contactInformation: ['', Validators.required],
      address: ['', Validators.required],
      photoPath: [''],
    });
  }

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id')!;
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (patient) => {
        this.patientForm.patchValue(patient);
        console.log('Loaded Patient:', patient);
      },
      error: (err) => console.error('Error loading patient:', err),
    });
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.patientService
        .updatePatient(this.patientId, this.patientForm.value)
        .subscribe({
          next: () => alert('Patient updated successfully!'),
          error: (err) => console.error('Error updating patient:', err),
        });
    }
  }
}
