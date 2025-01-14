import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppointmentService } from '../../../../services/appointment/appointment.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { Appointment, AppointmentStatus } from '../../../../models/appointment';
import { PatientService } from '../../../../services/patient/patient.service';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment-get-all',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './appointment-get-all.component.html',
  styleUrl: './appointment-get-all.component.css',
  providers: [NavigationService]
})
export class AppointmentGetAllComponent implements OnInit {
  appointments: Appointment[] = [];
  page: number = 1;
  size: number = 10;
  totalCount: number = 0;
  loading: boolean = false;
  error: string | null = null;
  AppointmentStatus = AppointmentStatus;

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    public authService: AuthService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  getStatusText(status: AppointmentStatus): string {
    return this.appointmentService.getStatusText(status);
  }

  loadAppointments(): void {
    if (this.authService.validateToken() && this.authService.getCurrentUser().role !== 'Patient') {
      this.loading = true;
      this.appointmentService.getAppointments(this.page, this.size).subscribe({
        next: (appointments: Appointment[]) => {
          const patientRequests = appointments.map(appointment =>
            this.patientService.getPatientById(appointment.patientId, {
              headers: this.authService.getAuthHeaders()
            })
          );
  
          const doctorRequests = appointments.map(appointment =>
            this.patientService.getPatientById(appointment.providerId, {
              headers: this.authService.getAuthHeaders()
            })
          );
  
          forkJoin({
            patients: forkJoin(patientRequests),
            doctors: forkJoin(doctorRequests)
          }).subscribe({
            next: (results) => {
              this.appointments = appointments.map((appointment, index) => ({
                ...appointment,
                patientName: `${results.patients[index].firstName} ${results.patients[index].lastName}`,
                doctorUsername: results.doctors[index].username
              }));
              this.totalCount = appointments.length;
              this.loading = false;
            },
            error: (error) => {
              console.error('Error loading details:', error);
              this.error = 'Failed to load appointment details';
              this.loading = false;
            }
          });
        },
        error: (error) => {
          this.error = 'Failed to load appointments';
          this.loading = false;
          console.error('Error:', error);
        }
      });
    }
  }

  onStatusChange(appointment: Appointment, newStatus: AppointmentStatus): void {
    if (appointment.appointmentId) {
      this.appointmentService.updateAppointmentStatus(appointment.appointmentId, newStatus)
        .subscribe({
          next: (updatedAppointment) => {
            const index = this.appointments.findIndex(a => a.appointmentId === appointment.appointmentId);
            if (index !== -1) {
              this.appointments[index].status = newStatus;
            }
          },
          error: (error) => {
            console.error('Error updating status:', error);
            alert('Failed to update appointment status');
          }
        });
    }
  }

  deleteAppointment(id: string): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.deleteAppointment(id).subscribe({
        next: () => {
          this.appointments = this.appointments.filter(app => app.appointmentId !== id);
          if (this.appointments.length === 0 && this.page > 1) {
            this.page--;
            this.loadAppointments();
          }
        },
        error: (error) => console.error('Error deleting appointment:', error)
      });
    }
  }

  isLastPage(): boolean {
    return this.page * this.size >= this.totalCount;
  }

  goBack(): void {
    this.navigationService.goBack();
  }
}
