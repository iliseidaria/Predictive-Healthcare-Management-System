import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PatientService, Patient } from '../../services/patient.service';

@Component({
  selector: 'app-get-all-patient',
  templateUrl: './get-all-patients.component.html',
  styleUrls: ['./get-all-patients.component.css']
})
export class GetAllPatientsComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {

  }

  onSubmit() {
  }
}
