import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../../../services/patient/patient.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../../../services/navigation/navigation.service';

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
          patient.dateOfBirth = this.formatDate(patient.dateOfBirth);
        }
        const genderMap: { [key: string]: number } = {
          'Male': 0,
          'Female': 1,
          'Other': 2
        };

        patient.gender = genderMap[patient.gender] || 0;

        this.patientForm.patchValue(patient);
        console.log('Loaded Patient:', patient);
      },
      error: (err) => console.error('Error loading patient:', err),
    });
  }

  onSubmit() {
    if (this.authService.validateToken()) {
      if (this.patientForm.valid) {
        this.patientId = this.route.snapshot.paramMap.get('id')!;
        const headers = this.authService.getAuthHeaders();
        const formValue = this.patientForm.value;

        // Format the data
        const patientData = {
          patientId: this.patientId,
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          dateOfBirth: formValue.dateOfBirth instanceof Date
            ? formValue.dateOfBirth.toISOString()
            : new Date(formValue.dateOfBirth).toISOString(),
          gender: parseInt(formValue.gender, 10),
          contactInformation: formValue.contactInformation,
          address: formValue.address,
          photoPath: formValue.photoPath || '', // Provide empty string if null
          // Include these if needed by backend
          username: formValue.username,
          email: formValue.email,
          role: formValue.role
        };

        console.log('Request body ID:', patientData.patientId);
        console.log('url ID:', this.patientId);

        // Call service with both patientData and headers
        this.patientService.updatePatient(this.patientId, patientData, { headers }).subscribe({
          next: () => {
            alert('Patient updated successfully!');
            this.router.navigate(['/get-all-patients']);
          },
          error: (err) => {
            console.error('Error updating patient:', err);
            alert('Failed to update patient. Please check all required fields.');
          }
        });
      } else {
        alert('Please fill in all required fields');
      }
    } else {
      console.error('Unauthorized or insufficient permissions');
    }
  }

  processPhoto(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.patientForm.patchValue({
          photoPath: e.target.result
        });
      };
      reader.readAsDataURL(file);
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
}
