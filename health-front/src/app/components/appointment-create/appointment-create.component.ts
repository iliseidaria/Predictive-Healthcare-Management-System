import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment/appointment.service';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { CreateAppointmentRequest, AppointmentStatus } from '../../models/appointment';
import { NavigationService } from '../../services/navigation/navigation.service';

@Component({
  selector: 'app-appointment-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointment-create.component.html',
  styleUrl: './appointment-create.component.css'
})
export class AppointmentCreateComponent {
  appointmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private router: Router,
    private navigationService: NavigationService
  ) {
    this.appointmentForm = this.fb.group({
      patientId: ['', [Validators.required]],
      appointmentDate: ['', [Validators.required]],
      appointmentTime: ['', [Validators.required]],
      reason: ['', [Validators.required]]
    });
  }

  goBack(): void {
    this.navigationService.goBack();
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser?.id) {
        alert('Provider ID not available. Please log in again.');
        return;
      }

      // Combine date and time into a proper ISO string
      const dateStr = formValue.appointmentDate;
      const timeStr = formValue.appointmentTime;
      const combinedDate = new Date(`${dateStr}T${timeStr}`);

      const appointment: CreateAppointmentRequest = {
        patientId: formValue.patientId,
        providerId: currentUser.id,
        appointmentDate: combinedDate,
        reason: formValue.reason,
        status: AppointmentStatus.Scheduled
      };

      this.appointmentService.createAppointment(appointment).subscribe({
        next: () => {
          this.router.navigate(['/appointment-detail/:id']); //aici trb bagat bearer token
        },
        error: (error) => {
          console.error('Error creating appointment:', error);
          alert('Failed to create appointment');
        }
      });
    }
  }
}
