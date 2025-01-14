import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../../../services/appointment/appointment.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { PatientService } from '../../../../services/patient/patient.service';
import { AppointmentStatus, Appointment } from '../../../../models/appointment';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment-update',
  templateUrl: './appointment-update.component.html',
  styleUrls: ['./appointment-update.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class AppointmentUpdateComponent implements OnInit {
  appointmentForm: FormGroup;
  appointmentId!: string;
  patientId!: string;
  providerId!: string;
  loading = false;
  patientName!: string;
  doctorUsername!: string;
  AppointmentStatus = AppointmentStatus; // For template usage
  appointmentStatuses = Object.values(AppointmentStatus)
    .filter(value => typeof value === 'number');

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.appointmentForm = this.fb.group({
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      reason: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.appointmentId = this.route.snapshot.paramMap.get('id')!;
    this.loadAppointment();
  }

  loadAppointment() {
    this.loading = true;
    this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
      next: (appointment: Appointment) => {
        // Store IDs for update
        this.patientId = appointment.patientId;
        this.providerId = appointment.providerId;

        forkJoin({
          patient: this.patientService.getPatientById(appointment.patientId),
          doctor: this.patientService.getPatientById(appointment.providerId)
        }).subscribe({
          next: (results) => {
            this.patientName = `${results.patient.firstName} ${results.patient.lastName}`;
            this.doctorUsername = results.doctor.username;
            
            const date = new Date(appointment.appointmentDate);
            this.appointmentForm.patchValue({
              appointmentDate: date.toISOString().split('T')[0],
              appointmentTime: date.toTimeString().split(':').slice(0, 2).join(':'),
              reason: appointment.reason,
              status: appointment.status
            });
            this.loading = false;
          }
        });
      }
    });
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      const dateStr = formValue.appointmentDate;
      const timeStr = formValue.appointmentTime;
      const combinedDate = new Date(`${dateStr}T${timeStr}`);

      const updatedAppointment: Appointment = {
        appointmentId: this.appointmentId,
        patientId: this.patientId,
        providerId: this.providerId,
        appointmentDate: combinedDate,
        reason: formValue.reason,
        status: formValue.status
      };

      this.appointmentService.updateAppointment(this.appointmentId, updatedAppointment)
        .subscribe({
          next: () => {
            alert('Appointment updated successfully');
            this.router.navigate(['/get-all-appointments']);
          },
          error: (error) => {
            console.error('Error updating appointment:', error);
            alert('Failed to update appointment');
          }
        });
    }
  }

  goBack(): void {
    window.history.back();
  }
}