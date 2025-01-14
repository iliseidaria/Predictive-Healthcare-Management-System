import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../../services/patient/patient.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';


@Component({
  selector: 'app-patient-create-medical-record',
  templateUrl: './patient-create-medical-record.component.html',
  styleUrls: ['./patient-create-medical-record.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [NavigationService]
})
export class PatientCreateMedicalRecordComponent implements OnInit {
  patientId!: string;
  medicalRecordData = {
    diagnosis: '',
    notes: '',
    date: '' 
  };
  errorMessage: string = ''; 

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private router: Router,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id')!;
    console.log('Patient ID:', this.patientId);
  }

  createMedicalRecord(): void {
    this.errorMessage = '';

    const dateValue = new Date(this.medicalRecordData.date);
    if (isNaN(dateValue.getTime())) {
      this.errorMessage = 'Please enter a valid date and time.'; 
      return;
    }

    const recordData = {
      ...this.medicalRecordData,
      date: dateValue.toISOString(), 
      patientId: this.patientId 
    };

    this.patientService.createMedicalRecord(this.patientId, recordData)
      .subscribe({
        next: () => {
          console.log('Medical record created successfully');
          this.router.navigate(['/get-all-patients']); 
        },
        error: (error: any) => {
          console.error('Error creating medical record:', error);
          this.errorMessage = 'An error occurred while creating the medical record. Please try again.'; 
        }
      });
  }

  goBack(): void {
    this.navigationService.goBack();
  }
}
