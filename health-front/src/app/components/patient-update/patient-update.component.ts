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
        // Conversie a datei în formatul corect pentru <input type="date">
        patient.dateOfBirth = this.formatDate(patient.dateOfBirth);
        this.patientForm.patchValue(patient);
        console.log('Loaded Patient:', patient);
      },
      error: (err) => console.error('Error loading patient:', err),
    });
  }
  
  // Funcție pentru conversia datei
  private formatDate(date: string): string {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = parsedDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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
