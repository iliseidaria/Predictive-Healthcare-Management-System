import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { MedicalRecordsService, MedicalRecord } from '../../../../services/medical-records/medical-records.service';

@Component({
  selector: 'app-medical-record-edit',
  templateUrl: './medical-record-edit.component.html',
  standalone: true,
  imports: [RouterLink],
  styleUrls: ['medical-records-edit.component.css','../../../home/test-page/css/test-page.component.css'],
})
export class MedicalRecordEditComponent {
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
      next: (record) => (this.record = record),
      error: (err) => console.error('Error fetching record:', err),
    });
  }

  saveRecord(): void {
    this.medicalRecordsService.updateMedicalRecord(this.record.recordId, this.record).subscribe({
      next: () => this.router.navigate(['/medical-records']),
      error: (err) => console.error('Error saving record:', err),
    });
  }

  cancelEdit(): void {
    this.router.navigate(['/medical-records']);
  }
}
