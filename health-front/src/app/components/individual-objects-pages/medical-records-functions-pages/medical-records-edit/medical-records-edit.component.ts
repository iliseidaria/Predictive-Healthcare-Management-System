import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { MedicalRecordsService, MedicalRecord } from '../../../../services/medical-records/medical-records.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LogoutButtonComponent} from '../../../buttons/logout-button/logout-button.component';
import {ViewProfileButtonComponent} from '../../../buttons/view-profile-button/view-profile-button.component';
@Component({
  selector: 'app-medical-record-edit',
  templateUrl: './medical-records-edit.component.html',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, LogoutButtonComponent, ViewProfileButtonComponent],
  styleUrls: ['../medical-records-css/medical-records-styles.css','../../../home/test-page/css/test-page.component.css'],
})
export class MedicalRecordEditComponent {
  record: Partial<Omit<MedicalRecord, 'recordId' | 'patientId'>> = {
    date: '',
    diagnosis: '',
    prescriptions: [],
    notes: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medicalRecordsService: MedicalRecordsService
  ) {}


  ngOnInit(): void {
    const recordId = this.route.snapshot.paramMap.get('id');
    if (recordId) {
      this.fetchRecord(recordId);
    }
  }


  fetchRecord(recordId: string): void {
    this.medicalRecordsService.getMedicalRecordById(recordId).subscribe({
      next: (record) => {
        // Exclude sensitive fields (recordId and patientId)
        this.record = {
          date: new Date(record.date).toISOString().slice(0, 16), // Convert to local datetime format
          diagnosis: record.diagnosis,
          prescriptions: record.prescriptions,
          notes: record.notes,
        };
      },
      error: (err) => console.error('Error fetching record:', err),
    });
  }

  saveRecord(): void {
    const recordId = this.route.snapshot.paramMap.get('id'); // Get recordId from the route
    if (recordId) {
      const updatedRecord = {
        ...this.record,
        recordId: recordId, // Ensure recordId is set
        date: new Date(this.record.date || '').toISOString(), // Ensure date is in ISO format
      } as MedicalRecord;

      this.medicalRecordsService.updateMedicalRecord(recordId, updatedRecord).subscribe({
        next: () => this.router.navigate(['/medical-records']),
        error: (err) => console.error('Error saving record:', err),
      });
    }
  }

  backToList(): void {
    this.router.navigate(['/medical-records']);
  }
  cancelEdit(): void {
    this.router.navigate(['/medical-records']);
  }
}
