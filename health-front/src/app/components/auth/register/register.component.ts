import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      doctorId: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      
      if (formData.role === 'doctor') {
        // First validate doctor ID
        this.authService.validateDoctorId(formData.doctorId).subscribe({
          next: (isValid) => {
            if (isValid) {
              this.proceedWithRegistration(formData);
            } else {
              alert('Invalid Doctor ID. Please check and try again.');
            }
          },
          error: (err) => {
            alert('Error validating Doctor ID. Please try again.');
          }
        });
      } else {
        // For patients, proceed directly
        this.proceedWithRegistration(formData);
      }
    }
  }

  private proceedWithRegistration(formData: any): void {
    this.authService.register(formData).subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
        alert('Registration successful!');
      },
      error: (err) => {
        if (err.error && err.error.error) {
          if (err.error.error.includes('Username already exists')) {
            alert('The username is already taken. Please choose another.');
          } else if (err.error.error.includes('Email already registered')) {
            alert('The email is already registered. Please use another email or login.');
          } else {
            alert('An error occurred during registration. Please try again.');
          }
        } else {
          console.error('Unexpected error:', err);
          alert('An unexpected error occurred. Please try again later.');
        }
      }
    });
  }

  // onSubmit(): void {
  //   if (this.registerForm.valid) {
  //     this.authService.register(this.registerForm.value).subscribe({
  //       next: () => {
  //         this.router.navigateByUrl('/login');
  //         alert('Registration successful!');
  //       },
  //       error: (err) => {
  //         if (err.error && err.error.error) {
  //           if (err.error.error.includes('Username already exists')) {
  //             alert('The username is already taken. Please choose another.');
  //           } else if (err.error.error.includes('Email already registered')) {
  //             alert('The email is already registered. Please use another email or login.');
  //           } else {
  //             alert('An error occurred during registration. Please try again.');
  //           }
  //         } else {
  //           console.error('Unexpected error:', err);
  //           alert('An unexpected error occurred. Please try again later.');
  //         }
  //       },
  //     });
  //   }
  // }
  
}
