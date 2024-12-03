import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PatientService, Patient } from '../../services/patient.service';

@Component({
  selector: 'app-update-patient',
  templateUrl: './update-patient.component.html',
  styleUrls: ['./update-patient.component.css']
})
export class UpdatePatientComponent implements OnInit {
  patientForm: FormGroup;
  patientId: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private patientService: PatientService
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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.patientId = id;
      this.patientService.getPatientById(this.patientId).subscribe((patient: Patient) => {
        this.patientForm.patchValue(patient);
      });
    } else {
      // Handle the case where id is null
    }
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.patientService.updatePatient(this.patientId, this.patientForm.value).subscribe(() => {
        // Handle success
      });
    }
  }
}
