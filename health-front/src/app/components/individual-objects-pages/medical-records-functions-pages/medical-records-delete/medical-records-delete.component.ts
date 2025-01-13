import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { MedicalRecordsService, MedicalRecord } from '../../../../services/medical-records/medical-records.service';

@Component({
  selector: 'app-medical-record-delete',
  templateUrl: './medical-records-delete.component.html',
  standalone: true,
  imports: [RouterLink],
})
export class MedicalRecordDeleteComponent implements OnInit {
  record: MedicalRecord | null = null;
  error: string | null = null;

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
      next: (record) => (this.record = record),
      error: (err) => {
        this.error = 'Failed to load record';
        console.error(err);
      },
    });
  }

  confirmDelete(): void {
    if (this.record) {
      this.medicalRecordsService.deleteMedicalRecord(this.record.recordId).subscribe({
        next: () => this.router.navigate(['/medical-records']),
        error: (err) => {
          this.error = 'Failed to delete record';
          console.error(err);
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/medical-records']);
  }
}
