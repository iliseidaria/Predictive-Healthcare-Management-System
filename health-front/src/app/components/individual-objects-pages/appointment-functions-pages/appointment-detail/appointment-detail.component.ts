import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../../../services/appointment/appointment.service';
import { PatientService } from '../../../../services/patient/patient.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { Appointment, AppointmentStatus } from '../../../../models/appointment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-detail.component.html',
  styleUrl: './appointment-detail.component.css',
  providers: [NavigationService]
})
export class AppointmentDetailComponent implements OnInit {
  appointment?: Appointment;
  loading = true;
  error?: string;
  AppointmentStatus = AppointmentStatus;

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private authService: AuthService,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAppointment(id);
    }
  }

  getStatusText(status: AppointmentStatus): string {
    return this.appointmentService.getStatusText(status);
  }

  loadAppointment(id: string) {
    if (this.authService.validateToken()) {
      this.loading = true;
      this.appointmentService.getAppointmentById(id).subscribe({
        next: (appointment) => {
          forkJoin({
            patient: this.patientService.getPatientById(appointment.patientId, {
              headers: this.authService.getAuthHeaders()
            }),
            doctor: this.patientService.getPatientById(appointment.providerId, {
              headers: this.authService.getAuthHeaders()
            })
          }).subscribe({
            next: (results) => {
              this.appointment = {
                ...appointment,
                patientName: `${results.patient.firstName} ${results.patient.lastName}`,
                doctorUsername: results.doctor.username
              };
              this.loading = false;
            },
            error: (error) => {
              this.error = 'Failed to load appointment details';
              this.loading = false;
            }
          });
        },
        error: (error) => {
          this.error = 'Failed to load appointment';
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.navigationService.goBack();
  }
}
