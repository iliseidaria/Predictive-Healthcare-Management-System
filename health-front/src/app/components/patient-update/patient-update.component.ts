import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../services/patient/patient.service';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigation/navigation.service';

@Component({
  selector: 'app-patient-update',
  styleUrl: './patient-update.component.css',
  templateUrl: './patient-update.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [NavigationService]
})
export class PatientUpdateComponent implements OnInit {
  patientForm: FormGroup;
  patientId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navigationService: NavigationService,
    private fb: FormBuilder,
    private patientService: PatientService,
    private authService: AuthService
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
    if (this.authService.validateToken() && this.authService.getCurrentUser().role !== 'Doctor') {
      this.patientId = this.route.snapshot.paramMap.get('id')!;
      const headers = this.authService.getAuthHeaders();
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
      this.patientService.updatePatient(this.patientId, { headers }).subscribe({
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

  goBack(): void {
    this.navigationService.goBack();
  }

  // onSubmit() {
  //   if (this.authService.isAuthenticated() && this.authService.getUserRole() !== 'Patient') {
  //     if (this.patientForm.valid) {
  //       const headers = this.authService.getAuthHeaders();
  //       this.patientService.updatePatient(this.patientId, this.patientForm.value, { headers }).subscribe({
  //         next: () => alert('Patient updated successfully!'),
  //         error: (err) => console.error('Error updating patient:', err),
  //       });
  //     } else {
  //       console.error('Form is invalid:', this.patientForm);
  //     }
  //   } else {
  //     console.error('Unauthorized or insufficient permissions');
  //   }
  // }
}
