import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AppointmentService } from '../../../../services/appointment/appointment.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { Appointment, AppointmentStatus } from '../../../../models/appointment';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../../services/patient/patient.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-get-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-get-appointments.component.html',
  styleUrl: './user-get-appointments.component.css',
  providers: [NavigationService]
})
export class UserGetAppointmentsComponent implements OnInit {
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
    private router: Router,
    public authService: AuthService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
      if (this.authService.validateToken() && this.authService.getCurrentUser().role !== 'Patient') {
        this.loading = true;
  
        // Fetch appointments
        this.appointmentService.getAppointments(1, 10).subscribe({
          next: (appointments) => {
            // Fetch user details for patientId and providerId in each appointment
            const userRequests = appointments.flatMap((appointment) => [
              this.patientService.getPatientById(appointment.patientId, {
                headers: this.authService.getAuthHeaders()
              }),
              this.patientService.getPatientById(appointment.providerId, {
                headers: this.authService.getAuthHeaders()
              })
            ]);
  
            forkJoin(userRequests).subscribe({
              next: (users) => {
                // Process the users to map patientId and providerId to their names
                const userMap = new Map(
                  users.map((user: any) => [user.id, `${user.firstName} ${user.lastName}`])
                );
  
                this.appointments = appointments.map((appointment) => ({
                  ...appointment,
                  patientName: userMap.get(appointment.patientId) || 'Unknown Patient',
                  doctorName: userMap.get(appointment.providerId) || 'Unknown Doctor'
                }));
  
                // Sort and filter for upcoming appointments
                const now = new Date();
                this.appointments = this.appointments
                  .filter((appointment) => new Date(appointment.appointmentDate) > now)
                  .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
                  .slice(0, 2);
  
                this.loading = false;
              },
              error: (error) => {
                console.error('Error loading user details:', error);
                this.error = 'Failed to load user details';
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
  

  // loadAppointments(): void {
  //   if (!this.authService.validateToken()) {
  //     this.router.navigate(['/login']);
  //     return;
  //   }
  
  //   const currentUser = this.authService.getCurrentUser();
  //   if (!currentUser || !currentUser.id) {
  //     this.error = 'User information not found';
  //     return;
  //   }
  
  //   console.log('Loading appointments for user:', currentUser);
  //   this.loading = true;
  
  //   // Call different endpoints based on role
  //   const appointmentsObservable = currentUser.role === 'patient' 
  //     ? this.appointmentService.getUserAppointments(currentUser.id, this.page, this.size)
  //     : this.appointmentService.getDoctorAppointments(currentUser.id, this.page, this.size);
  
  //   appointmentsObservable.subscribe({
  //     next: (appointments: Appointment[]) => {
  //       console.log('Received appointments:', appointments);
  //       this.appointments = appointments;
  //       this.totalCount = appointments.length;
  //       this.loading = false;
  //     },
  //     error: (error) => {
  //       console.error('Failed to load appointments:', error);
  //       this.error = 'Failed to load appointments';
  //       this.loading = false;
  //     }
  //   });
  // }

  getStatusText(status: AppointmentStatus): string {
    return this.appointmentService.getStatusText(status);
  }

  isLastPage(): boolean {
    return (this.page * this.size) >= this.totalCount;
  }

  goBack(): void {
    this.navigationService.goBack();
  }

  // deleteAppointment(id: string): void {
  //   if (confirm('Are you sure you want to delete this appointment?')) {
  //     this.appointmentService.deleteAppointment(id, {
  //       headers: this.authService.getAuthHeaders()
  //     }).subscribe({
  //       next: () => {
  //         this.loadAppointments();
  //       },
  //       error: (error) => {
  //         console.error('Error deleting appointment:', error);
  //         this.error = 'Failed to delete appointment';
  //       }
  //     });
  //   }
  // }
}
