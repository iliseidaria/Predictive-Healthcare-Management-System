import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment/appointment.service';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { AppointmentStatus } from '../../models/appointment';

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
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      patientId: ['', [Validators.required]],
      providerId: ['', [Validators.required]],
      appointmentDate: ['', [Validators.required]],
      appointmentTime: ['', [Validators.required]],
      reason: ['', [Validators.required]]
    });
  }

  goBack() {
    this.router.navigate(['/test-page']);
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      
      // Combine date and time
      const dateStr = formValue.appointmentDate;
      const timeStr = formValue.appointmentTime;
      const combinedDate = new Date(`${dateStr}T${timeStr}`);

      const appointment = {
        patientId: formValue.patientId,
        providerId: formValue.providerId,
        appointmentDate: combinedDate,
        reason: formValue.reason,
        status: AppointmentStatus.Scheduled
      };

      this.appointmentService.createAppointment(appointment).subscribe({
        next: () => {
          this.router.navigate(['/appointments']);
        },
        error: (error) => {
          console.error('Error creating appointment:', error);
          alert('Failed to create appointment');
        }
      });
    }
  }
}
