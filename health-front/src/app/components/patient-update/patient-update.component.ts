import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../services/patient/patient.service';
import { AuthService } from '../../services/auth/auth.service';
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
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private patientService: PatientService,
    private authService: AuthService
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
    if (this.authService.isAuthenticated() && this.authService.getUserRole() !== 'Doctor') {
      this.patientId = this.route.snapshot.paramMap.get('id')!;
      const headers = this.authService.getAuthHeaders();
      this.patientService.getPatientById(this.patientId, { headers }).subscribe({
        next: (patient) => {
          patient.dateOfBirth = this.formatDate(patient.dateOfBirth);
          this.patientForm.patchValue(patient);
          console.log('Loaded Patient:', patient);
        },
        error: (err) => console.error('Error loading patient:', err),
      });
    } else {
      console.error('Unauthorized or insufficient permissions');
      // this.router.navigateByUrl('/unauthorized');
    }
  }

  private formatDate(date: string): string {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = parsedDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    if (this.authService.isAuthenticated() && this.authService.getUserRole() !== 'Patient') {
      if (this.patientForm.valid) {
        const headers = this.authService.getAuthHeaders();
        this.patientService.updatePatient(this.patientId, this.patientForm.value, { headers }).subscribe({
          next: () => alert('Patient updated successfully!'),
          error: (err) => console.error('Error updating patient:', err),
        });
      } else {
        console.error('Form is invalid:', this.patientForm);
      }
    } else {
      console.error('Unauthorized or insufficient permissions');
    }
  }
}
