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
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  navigateTo(path: string) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate([path]);
    } else {
      alert('You must be logged in to access this page.');
      this.router.navigate(['/login']);  // Redirect to login page if not authenticated
    }
  }

  // Validator personalizat pentru potrivirea parolelor
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // onSubmit(): void {
  //   if (this.registerForm.valid) {
  //     this.authService.register(this.registerForm.value).subscribe({
  //       next: () => {
  //         alert('Registration successful!');
  //         this.router.navigateByUrl('/login');
  //       },
  //       error: (err) => console.error('Registration failed:', err),
  //     });
  //   }
  // }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
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
        },
      });
    }
  }
  
}
