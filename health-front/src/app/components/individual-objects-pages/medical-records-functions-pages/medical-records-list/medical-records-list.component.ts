import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MedicalRecordsService, MedicalRecord } from '../../../../services/medical-records/medical-records.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ViewProfileButtonComponent } from '../../../buttons/view-profile-button/view-profile-button.component';
import { LogoutButtonComponent } from '../../../buttons/logout-button/logout-button.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-medical-records-list',
  templateUrl: './medical-records-list.component.html',
  standalone: true,
  styleUrls: ['../medical-records-css/medical-records-list.component.css', '../../../home/test-page/css/test-page.component.css'],
  imports: [CommonModule, ViewProfileButtonComponent, LogoutButtonComponent, RouterModule],
})
export class MedicalRecordsListComponent implements OnInit {
  medicalRecords: MedicalRecord[] = [];
  loading = false;
  error: string | null = null;
  userRole: string = ''; // Add userRole to store the current user's role

  constructor(
    private router: Router,
    private medicalRecordsService: MedicalRecordsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('Initializing MedicalRecordsListComponent...');
    this.userRole = this.authService.getCurrentUser()?.role || ''; // Get the user role
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
   * Navigate to the "Create New Medical Record" page.
   */
  goToCreateNewRecord(): void {
    this.router.navigate(['/get-all-patients']);
  }

  /**
   * Go back to the previous page.
   */
  goBack(): void {
    this.router.navigate(['..']); // Navigate back to the previous route
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
