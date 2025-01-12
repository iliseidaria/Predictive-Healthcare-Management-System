import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { forkJoin } from 'rxjs';
import { AppointmentService } from '../../services/appointment/appointment.service';
import { NavigationService } from '../../services/navigation/navigation.service';
import { Appointment, AppointmentStatus } from '../../models/appointment';
import { PatientService } from '../../services/patient/patient.service';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./css/panel-style.css','./css/test-page.component.css', './css/grid-style.css', './css/appointments-table.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TestPageComponent implements OnInit, OnDestroy {
  private tokenCheckSubscription?: Subscription;
  userRole: string = '';
  gridItems: string[] = Array.from({ length: 42 }, (_, i) => `Item ${i + 1}`);
  appointments: any[] = []; // Full appointments list
  upcomingAppointments: any[] = []; // Filtered upcoming appointments
  error: string | null = null;
  loading = false;
  constructor(private router: Router, public authService: AuthService, private appointmentService: AppointmentService, private patientService: PatientService) {}


  ngOnInit() {
    // Check token immediately on init
    if (!this.authService.validateToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadAppointments();

    this.userRole = this.authService.getCurrentUser().role || '';

    // Continue checking token every minute
    this.tokenCheckSubscription = interval(60000).subscribe(() => {
      this.authService.validateToken();
    });
  }
  loadAppointments(): void {
    if (this.authService.validateToken() ) {
      this.loading = true;
      this.appointmentService.getAppointments(1, 10).subscribe({
        next: (appointments) => {
          const patientRequests = appointments.map((appointment) =>
            this.patientService.getPatientById(appointment.patientId, {
              headers: this.authService.getAuthHeaders()
            })
          );

          forkJoin(patientRequests).subscribe({
            next: (patients) => {
              this.appointments = appointments.map((appointment, index) => ({
                ...appointment,
                patientName: `${patients[index].firstName} ${patients[index].lastName}`
              }));

              // Sort and filter for upcoming appointments
              const now = new Date();
              this.upcomingAppointments = this.appointments
                .filter((appointment) => new Date(appointment.appointmentDate) > now)
                .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
                .slice(0, 2);

              this.loading = false;
            },
            error: (error) => {
              console.error('Error loading patient details:', error);
              this.error = 'Failed to load patient details';
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

  ngOnDestroy() {
    if (this.tokenCheckSubscription) {
      this.tokenCheckSubscription.unsubscribe();
    }
  }

  // Navigate to a specific route only if the user is authenticated
  navigateTo(path: string) {
    if (this.authService.validateToken()) {
      this.router.navigate([path]);
    } else {
      alert('You must be logged in to access this page.');
      this.router.navigate(['/login']);
    }
  }

  logout() {
    if (this.authService.validateToken()) {
      this.authService.logout().subscribe({
        next: () => {
          console.log('Logout successful');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Logout error:', err);
          this.authService.handleLogout();
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadProfile() {
    if (this.authService.validateToken()) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser && (currentUser.username || currentUser.email)) {
        alert(`Profile Information:
              Username: ${currentUser.username || 'Not available'}
              Email: ${currentUser.email || 'Not available'}
              Role: ${currentUser.role || 'Not available'}`
        );
      } else {
        alert('Could not load profile information. Token may be invalid.');
      }
    } else {
      alert('You must be logged in to view your profile.');
      this.router.navigate(['/login']);
    }
  }
}
