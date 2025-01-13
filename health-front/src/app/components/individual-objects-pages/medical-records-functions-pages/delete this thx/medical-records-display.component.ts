import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import {MedicalRecordsService} from '../../../../services/medical-records/medical-records.service';

interface MedicalRecord {
  recordId: string;
  patientId: string;
  date: string;
  diagnosis: string;
  notes: string;
}

@Component({
  selector: 'app-medical-records',
  templateUrl: './medical-records.component.html',
  styleUrls: ['./medical-records.component.css'],
  standalone: true
})
export class MedicalRecordsComponent implements OnInit {
  medicalRecords: MedicalRecord[] = [];
  private medicalRecordsService: MedicalRecordsService;
  page = 1;
  size = 5; // Number of records per page
  hasNextPage = true;

  constructor(private http: HttpClient, ) {
  }

  ngOnInit(): void {
    this.loadMedicalRecords();
  }

  loadMedicalRecords(): void {
    const userId = 'some-user-id'; // Replace with actual user ID
    this.http
      .get<MedicalRecord[]>(
        `${environment.apiUrl}/api/v1/MedicalRecord/user/${userId}`,
        { params: { page: this.page.toString(), size: this.size.toString() } }
      )
      .subscribe((records) => {
        this.medicalRecords = records;
        this.hasNextPage = records.length === this.size;
      });
  }

  viewRecord(recordId: string): void {
    console.log('View record:', recordId);
    // Fetch the medical record by ID and navigate to its details page
    this.medicalRecordsService.getMedicalRecordById(recordId).subscribe(
      (record) => {
        console.log('Fetched Record:', record);
        this.router.navigate(['/medical-record', recordId]);
      },
      (error) => {
        console.error('Error fetching record:', error);
      }
    );
  }

  editRecord(recordId: string): void {
      console.log('Edit record:', recordId);
      // Navigate to the record edit page
      this.router.navigate(['/medical-record/', recordId]);
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadMedicalRecords();
    }
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.page++;
      this.loadMedicalRecords();
    }
  }
}
