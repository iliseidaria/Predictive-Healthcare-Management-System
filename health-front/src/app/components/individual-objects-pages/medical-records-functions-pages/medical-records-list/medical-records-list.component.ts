import { Component, OnInit } from '@angular/core';
import { MedicalRecordsService, MedicalRecord } from '../../../../services/medical-records/medical-records.service';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../../services/auth/auth.service';
import {CommonModule} from '@angular/common';
import {ViewProfileButtonComponent} from '../../../buttons/view-profile-button/view-profile-button.component';
import {LogoutButtonComponent} from '../../../buttons/logout-button/logout-button.component';

@Component({
  selector: 'app-medical-records-list',
  templateUrl: './medical-records-list.component.html',
  standalone: true,
  styleUrls: ['medical-records-list.component.css','../../../home/test-page/css/test-page.component.css'],
  imports: [RouterLink, CommonModule, ViewProfileButtonComponent, LogoutButtonComponent],
})
export class MedicalRecordsListComponent implements OnInit {
  medicalRecords: MedicalRecord[] = [];
  loading = false;
  error: string | null = null;

  constructor(private router: Router, private medicalRecordsService: MedicalRecordsService, private authService: AuthService) {}

  ngOnInit(): void {
    console.log('idk..')
    this.getMedicalRecords();
  }

  getMedicalRecords(): void {
    this.loading = true;
    this.error = null;
    const userId = this.authService.getCurrentUser().id; // Replace with dynamic user ID logic
    console.log('Getting medical records...');
    console.log(userId);

    this.medicalRecordsService.getUserMedicalRecords(userId, 1, 10).subscribe({
      next: (records) => {
        this.medicalRecords = records;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch records';
        console.error(err);
        this.loading = false;
      },
    });
  }
  deleteRecord(recordId: string): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.medicalRecordsService.deleteMedicalRecord(recordId).subscribe({
        next: () => {
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
