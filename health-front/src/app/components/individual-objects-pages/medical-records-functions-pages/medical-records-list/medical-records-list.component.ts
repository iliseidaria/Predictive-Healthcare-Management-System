import { Component, OnInit } from '@angular/core';
import { MedicalRecordsService, MedicalRecord } from '../../../../services/medical-records/medical-records.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ViewProfileButtonComponent } from '../../../buttons/view-profile-button/view-profile-button.component';
import { LogoutButtonComponent } from '../../../buttons/logout-button/logout-button.component';

@Component({
  selector: 'app-medical-records-list',
  templateUrl: './medical-records-list.component.html',
  standalone: true,
  styleUrls: ['../medical-records-css/medical-records-list.component.css', '../../../home/test-page/css/test-page.component.css'],
  imports: [RouterLink, CommonModule, ViewProfileButtonComponent, LogoutButtonComponent],
})
export class MedicalRecordsListComponent implements OnInit {
  medicalRecords: MedicalRecord[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private medicalRecordsService: MedicalRecordsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('Initializing MedicalRecordsListComponent...');
    this.getMedicalRecords();
  }

  /**
   * Fetch medical records for the currently authenticated user.
   */
  getMedicalRecords(): void {
    this.loading = true;
    this.error = null;

    const currentUser = this.authService.getCurrentUser(); // Get the authenticated user's ID
    if (!currentUser || !currentUser.id) {
      this.error = 'Unable to fetch records: User not authenticated.';
      this.loading = false;
      return;
    }

    console.log('Fetching medical records for user ID:', currentUser.id);

    this.medicalRecordsService.getUserMedicalRecords(currentUser.id, 1, 10).subscribe({
      next: (records) => {
        console.log('Fetched medical records:', records);
        this.medicalRecords = records;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch records';
        console.error('Error fetching medical records:', err);
        this.loading = false;
      },
    });
  }

  /**
   * Deletes a medical record by its ID.
   * @param recordId - The ID of the record to delete.
   */
  deleteRecord(recordId: string): void {
    if (confirm('Are you sure you want to delete this record?')) {
      console.log('Deleting record with ID:', recordId);

      this.medicalRecordsService.deleteMedicalRecord(recordId).subscribe({
        next: () => {
          console.log(`Successfully deleted record with ID: ${recordId}`);
          this.medicalRecords = this.medicalRecords.filter((r) => r.recordId !== recordId);
        },
        error: (err) => {
          console.error('Failed to delete record:', err);
          alert('Failed to delete record');
        },
      });
    }
  }
}
