import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AppointmentService } from '../../services/appointment/appointment.service';
import { AuthService } from '../../services/auth/auth.service';
import { NavigationService } from '../../services/navigation/navigation.service';
import { Appointment, AppointmentStatus } from '../../models/appointment';
import { FormsModule } from '@angular/forms';

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
    private router: Router,
    private authService: AuthService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    if (!this.authService.validateToken()) {
      this.router.navigate(['/login']);
      return;
    }
  
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.error = 'User information not found';
      return;
    }
  
    console.log('Loading appointments for user:', currentUser.id);
    this.loading = true;
    
    this.appointmentService.getUserAppointments(currentUser.id, this.page, this.size, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (appointments: Appointment[]) => {
        console.log('Received appointments:', appointments);
        this.appointments = appointments;
        this.totalCount = appointments.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load appointments:', error);
        this.error = 'Failed to load appointments';
        this.loading = false;
      }
    });
  }

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