import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-create-patient',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.css']
})
export class CreatePatientComponent implements OnInit {
  patientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router
  ) {
    this.patientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      contactInformation: ['', Validators.required],
      address: ['', Validators.required],
      photoPath: ['']
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.patientForm.valid) {
      this.patientService.createPatient(this.patientForm.value).subscribe(() => {
        this.router.navigate(['/patients']);
      });
    }
  }
}
