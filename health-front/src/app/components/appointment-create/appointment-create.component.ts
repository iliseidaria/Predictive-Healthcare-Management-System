import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment/appointment.service';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Appointment, AppointmentStatus } from '../../models/appointment';
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
    if (this.appointmentForm.valid && this.authService.isAuthenticated() && this.authService.getCurrentUser().role !== 'Patient') {
      const formValue = this.appointmentForm.value;
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser?.id) {
        alert('Provider ID not available. Please log in again.');
        return;
      }

      // Combine date and time into a proper ISO string
      const dateStr = formValue.appointmentDate;
      const timeStr = formValue.appointmentTime;
      // Ensure proper date format
      // const [year, month, day] = dateStr.split('-').map(Number);
      // const [hours, minutes] = timeStr.split(':').map(Number);
      // const combinedDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

      // if (isNaN(combinedDate.getTime())) {
      //   throw new Error('Invalid date/time combination');
      // }
      const combinedDate = new Date(`${dateStr}T${timeStr}`);

      const appointment: Appointment = {
        patientId: formValue.patientId,
        providerId: currentUser.id,
        appointmentDate: combinedDate,
        reason: formValue.reason,
        status: AppointmentStatus.Scheduled
      };

      console.log('Form Data Sent:', appointment);
      this.appointmentService.createAppointment(appointment).subscribe({
        next: (response) => {
          console.log('Full response:', response);
          alert('Appointment created successfully!');
          console.log('Response ID:', response.appointmentId);
          this.router.navigateByUrl(`/appointment-detail/${response.appointmentId}`);
        },
        error: (error) => {
          console.error('Error creating appointment:', error);
          alert('Failed to create appointment');
        }
      });
    }
  }
}
