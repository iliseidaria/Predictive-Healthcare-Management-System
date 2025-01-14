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
    if (this.authService.validateToken() && this.authService.getCurrentUser().role !== 'Patient') {
      this.loading = true;
      this.appointmentService.getAppointments(1, 10).subscribe({
        next: (appointments) => {
          const patientRequests = appointments.map(appointment =>
            this.userService.getUserById(appointment.patientId, {
              headers: this.authService.getAuthHeaders()
            })
          );

          forkJoin(patientRequests).subscribe({
            next: (patients) => {
              const patientMap = new Map(
                patients.map((patient: any) => [patient.id, `${patient.firstName} ${patient.lastName}`])
              );

              this.appointments = appointments.map((appointment) => ({
                ...appointment,
                patientName: patientMap.get(appointment.patientId) || 'Unknown Patient'
              }));

              const now = new Date();
              this.upcomingAppointments = this.appointments
                .filter(appointment => 
                  new Date(appointment.appointmentDate) > now && 
                  appointment.status === 0) // 0 = Scheduled status
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

//  loadAppointments(): void {
//     if (this.authService.validateToken() && this.authService.getCurrentUser().role !== 'Patient') {
//       this.loading = true;

//       // Fetch appointments
//       this.appointmentService.getAppointments(1, 10).subscribe({
//         next: (appointments) => {
//           // Fetch user details for patientId and providerId in each appointment
//           const userRequests = appointments.flatMap((appointment) => [
//             this.userService.getUserById(appointment.patientId, {
//               headers: this.authService.getAuthHeaders()
//             }),
//             this.userService.getUserById(appointment.providerId, {
//               headers: this.authService.getAuthHeaders()
//             })
//           ]);

//           forkJoin(userRequests).subscribe({
//             next: (users) => {
//               // Process the users to map patientId and providerId to their names
//               const userMap = new Map(
//                 users.map((user: any) => [user.id, `${user.firstName} ${user.lastName}`])
//               );

//               this.appointments = appointments.map((appointment) => ({
//                 ...appointment,
//                 patientName: userMap.get(appointment.patientId) || 'Unknown Patient',
//                 doctorName: userMap.get(appointment.providerId) || 'Unknown Doctor'
//               }));

//               // Sort and filter for upcoming appointments
//               const now = new Date();
//               this.upcomingAppointments = this.appointments
//                 .filter((appointment) => new Date(appointment.appointmentDate) > now)
//                 .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
//                 .slice(0, 2);

//               this.loading = false;
//             },
//             error: (error) => {
//               console.error('Error loading user details:', error);
//               this.error = 'Failed to load user details';
//               this.loading = false;
//             }
//           });
//         },
//         error: (error) => {
//           this.error = 'Failed to load appointments';
//           this.loading = false;
//           console.error('Error:', error);
//         }
//       });
//     }
//   }

  navigateToPatients(): void {
    this.router.navigate(['/get-all-patients']);
  }

  navigateToAppointments(): void {
    this.router.navigate(['/get-user-appointments']);
  }

  navigateToAllAppointments(): void {
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