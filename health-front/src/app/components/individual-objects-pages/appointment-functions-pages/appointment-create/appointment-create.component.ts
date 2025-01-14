import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../../../services/appointment/appointment.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Appointment, AppointmentResponse, AppointmentStatus } from '../../../../models/appointment';
import { NavigationService } from '../../../../services/navigation/navigation.service';

@Component({
  selector: 'app-appointment-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointment-create.component.html',
  styleUrl: './appointment-create.component.css'
})
export class AppointmentCreateComponent implements OnInit {
  appointmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private router: Router,
    private navigationService: NavigationService,
    private route: ActivatedRoute
  ) {
    this.appointmentForm = this.fb.group({
      patientId: ['', [Validators.required]],
      appointmentDate: ['', [Validators.required]],
      appointmentTime: ['', [Validators.required]],
      reason: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['patientId']) {
        this.appointmentForm.patchValue({
          patientId: params['patientId']
        });
      }
    });
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      const currentUser = this.authService.getCurrentUser();

      const dateStr = formValue.appointmentDate;
      const timeStr = formValue.appointmentTime;
      const combinedDate = new Date(`${dateStr}T${timeStr}`);

      const appointment: Appointment = {
        patientId: formValue.patientId,
        providerId: currentUser.id,
        appointmentDate: combinedDate,
        reason: formValue.reason,
        status: AppointmentStatus.Scheduled // Explicitly set to enum value
      };

      console.log('Sending appointment:', appointment); // Debug log

      this.appointmentService.createAppointment(appointment).subscribe({
        next: (response: AppointmentResponse) => {
          alert('Appointment created successfully!');
          this.router.navigateByUrl(`/appointment-detail/${response.id}`);
        },
        error: (error) => {
          console.error('Error creating appointment:', error);
          alert('Failed to create appointment');
        }
      });
    }
  }

  // onSubmit() {
  //   if (this.appointmentForm.valid) {
  //     const formValue = this.appointmentForm.value;
  //     const currentUser = this.authService.getCurrentUser();

  //     const dateStr = formValue.appointmentDate;
  //     const timeStr = formValue.appointmentTime;
  //     const combinedDate = new Date(`${dateStr}T${timeStr}`);

  //     const appointment: Appointment = {
  //       patientId: formValue.patientId,
  //       providerId: currentUser.id, // Get from current user
  //       appointmentDate: combinedDate,
  //       reason: formValue.reason,
  //       status: 0
  //     };

  //     this.appointmentService.createAppointment(appointment).subscribe({
  //       next: (response: AppointmentResponse) => {
  //         alert('Appointment created successfully!');
  //         this.router.navigateByUrl(`/appointment-detail/${response.id}`);
  //       },
  //       error: (error) => {
  //         console.error('Error creating appointment:', error);
  //         alert('Failed to create appointment');
  //       }
  //     });
  //   }
  // }

  goBack(): void {
    this.navigationService.goBack();
  }
}