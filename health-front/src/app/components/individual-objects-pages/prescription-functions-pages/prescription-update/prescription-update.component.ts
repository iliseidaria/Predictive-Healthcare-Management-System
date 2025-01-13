import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PrescriptionService } from '../../../../services/prescription/prescription.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { toUTC } from '../../patient-functions-pages/patient-create/patient-create.component';

@Component({
  selector: 'app-prescription-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './prescription-update.component.html',
  styleUrl: './prescription-update.component.css'
})
export class PrescriptionUpdateComponent implements OnInit {
  prescriptionForm: FormGroup;
  prescriptionId!: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService,
    private authService: AuthService,
    private navigationService: NavigationService
  ) {
    this.prescriptionForm = this.fb.group({
      prescriptionId: ['', Validators.required],
      patientId: ['', Validators.required],
      medicationName: ['', Validators.required],
      dosage: ['', Validators.required],
      frequency: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    this.prescriptionId = this.route.snapshot.paramMap.get('id')!;
    const headers = this.authService.getAuthHeaders();

    this.prescriptionService.getPrescriptionById(this.prescriptionId, { headers }).subscribe({
      next: (prescription) => {
        this.prescriptionForm.patchValue({
          ...prescription,
          startDate: new Date(prescription.startDate).toISOString().split('T')[0],
          endDate: new Date(prescription.endDate).toISOString().split('T')[0]
        });
      },
      error: (err) => console.error('Error loading prescription:', err)
    });
  }

  onSubmit() {
    if (this.prescriptionForm.valid) {
      const formValue = this.prescriptionForm.value;
      // Convert dates to UTC explicitly
      const startDate = new Date(formValue.startDate);
      const endDate = new Date(formValue.endDate);

      const prescriptionData = {
        ...formValue,
        prescriptionId: this.prescriptionId,
        startDate: startDate.toISOString(), // Convert to ISO string for UTC
        endDate: endDate.toISOString(),
      };

      const headers = this.authService.getAuthHeaders();
      this.prescriptionService.updatePrescription(
        this.prescriptionId,
        prescriptionData,
        { headers }
      ).subscribe({
        next: () => this.navigationService.goBack(),
        error: (err) => console.error('Error updating prescription:', err)
      });
    }
  }

  goBack(): void {
    this.navigationService.goBack();
  }
}
