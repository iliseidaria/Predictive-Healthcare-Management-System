import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {LoginComponent} from '../../../auth/login/login.component';
import { MedicalRecordsService, MedicalRecord } from '../../../../services/medical-records/medical-records.service';
import { CommonModule } from '@angular/common';
import {ViewProfileButtonComponent} from '../../../buttons/view-profile-button/view-profile-button.component';
import {LogoutButtonComponent} from '../../../buttons/logout-button/logout-button.component';

@Component({
  selector: 'app-medical-record-view',
  templateUrl: './medical-records-view.component.html',
  standalone: true,
  styleUrls: ['../medical-records-css/medical-records-styles.css', '../../../home/test-page/css/test-page.component.css'],
  imports: [CommonModule, ViewProfileButtonComponent, LogoutButtonComponent],
})
export class MedicalRecordViewComponent implements OnInit {
  record: MedicalRecord = {
    recordId: '',
    patientId: '',
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
        this.record = record;
      },
      error: (err) => console.error('Error fetching record:', err),
    });
  }

  backToList(): void {
    this.router.navigate(['/medical-records']);
  }
}
