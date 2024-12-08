import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import {RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-get-all',
  templateUrl: './patient-get-all.component.html',
  imports: [
    CommonModule,
    RouterLink
  ],
  standalone: true
})
export class PatientGetAllComponent implements OnInit {
  patients: any[] = [];
  page = 1;
  size = 10;

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.getAllPatients(this.page, this.size).subscribe({
      next: (data) => (this.patients = data.items || []),
      error: (err) => console.error(err),
    });
  }

  deletePatient(id: string) {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.patientService.deletePatient(id).subscribe({
        next: () => {
          alert('Patient deleted successfully');
          this.loadPatients();
        },
        error: (err) => console.error(err),
      });
    }
  }
}
