import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import  {RouterModule} from '@angular/router';
import { AppointmentService } from '../../../services/appointment/appointment.service';
import { NavigationService } from '../../../services/navigation/navigation.service';
import { Appointment, AppointmentStatus } from '../../../models/appointment';
import {RouterLink} from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { ViewProfileButtonComponent } from '../../buttons/view-profile-button/view-profile-button.component';
import {LogoutButtonComponent} from '../../buttons/logout-button/logout-button.component';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./css/panel-style.css','./css/test-page.component.css', './css/grid-style.css', './css/appointments-table.css', './css/health-panel.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, ViewProfileButtonComponent, LogoutButtonComponent]
})
export class TestPageComponent implements OnInit, OnDestroy {
  private tokenCheckSubscription?: Subscription;
  userRole: string = '';
  gridItems: string[] = Array.from({ length: 42 }, (_, i) => `Item ${i + 1}`);
  appointments: any[] = []; // Full appointments list
  upcomingAppointments: any[] = []; // Filtered upcoming appointments
  error: string | null = null;
  loading = false;
  constructor(private router: Router, public authService: AuthService, private appointmentService: AppointmentService, private patientService: UserService) {}


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
    if (this.authService.validateToken() && this.authService.getCurrentUser().role !== 'Patient') {
      this.loading = true;

      // Fetch appointments
      this.appointmentService.getAppointments(1, 10).subscribe({
        next: (appointments) => {
          // Fetch user details for patientId and providerId in each appointment
          const userRequests = appointments.flatMap((appointment) => [
            this.patientService.getUserById(appointment.patientId, {
              headers: this.authService.getAuthHeaders()
            }),
            this.patientService.getUserById(appointment.providerId, {
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
              this.upcomingAppointments = this.appointments
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

  viewMedicalHistory(): void {
    this.router.navigate(['/medical-history']);
  }

  viewPrescriptions(): void {
    this.router.navigate(['/get-user-prescriptions']);
  }

  viewHealthRisks(): void {
    this.router.navigate(['/health-risks']);
  }

  searchDoctors(): void {
    this.router.navigate(['/search-doctors']);
  }
}
