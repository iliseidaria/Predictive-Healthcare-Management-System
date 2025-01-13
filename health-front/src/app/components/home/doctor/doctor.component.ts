import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { AppointmentService } from '../../../services/appointment/appointment.service';
import { UserService } from '../../../services/user/user.service';
import { ViewProfileButtonComponent } from '../../buttons/view-profile-button/view-profile-button.component';
import { LogoutButtonComponent } from '../../buttons/logout-button/logout-button.component';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css', '../test-page/css/grid-style.css', '../test-page/css/appointments-table.css', '../test-page/css/health-panel.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, ViewProfileButtonComponent, LogoutButtonComponent]
})
export class DoctorComponent implements OnInit {
  upcomingAppointments: any[] = [];
  appointments: any[] = []; // Full appointments list
  error: string | null = null;
  users: any[] = [];
  loading = false;

  constructor(
    private router: Router,
    public authService: AuthService,
    private appointmentService: AppointmentService,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (!this.authService.validateToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadAppointments();
  }

  loadAppointments(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'doctor') {
      this.error = 'Unauthorized access';
      return;
    }
  
    this.loading = true;
    this.appointmentService.getUserAppointments(currentUser.id, 1, 5, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (response: any) => {
        // Ensure we have an array of appointments
        const appointments = Array.isArray(response) ? response : response.items || [];
        
        // Create user requests only if we have appointments
        if (appointments.length > 0) {
          const userRequests = appointments.flatMap((appointment: any) => [
            this.userService.getUserById(appointment.patientId, {
              headers: this.authService.getAuthHeaders()
            }),
            this.userService.getUserById(appointment.providerId, {
              headers: this.authService.getAuthHeaders()
            })
          ]);

          forkJoin(userRequests).subscribe({
            next: (users: any) => {
              const userMap = new Map(
                users.map((user: any) => [user.id, `${user.firstName} ${user.lastName}`])
              );

              this.appointments = appointments.map((appointment: any) => ({
                ...appointment,
                patientName: userMap.get(appointment.patientId) || 'Unknown Patient',
                doctorName: userMap.get(appointment.providerId) || 'Unknown Doctor'
              }));

              const now = new Date();
              this.upcomingAppointments = this.appointments
                .filter((appointment) => new Date(appointment.appointmentDate) > now)
                .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
                .slice(0, 3);
            },
            error: (error) => {
              console.error('Error loading user details:', error);
              this.error = 'Failed to load user details';
            }
          });
        } else {
          this.appointments = [];
          this.upcomingAppointments = [];
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load appointments';
        console.error('Error:', error);
        this.loading = false;
      }
    });
}

  navigateToPatients(): void {
    this.router.navigate(['/get-all-patients']);
  }

  navigateToAppointments(): void {
    this.router.navigate(['/get-all-appointments']);
  }

  navigateToPrescriptions(): void {
    this.router.navigate(['/get-user-prescriptions']);
  }

  navigateToMedicalRecords(): void {
    this.router.navigate(['/medical-records']);
  }
  navigateToUsers(): void {
    this.router.navigate(['/get-all-users']);
  }
}