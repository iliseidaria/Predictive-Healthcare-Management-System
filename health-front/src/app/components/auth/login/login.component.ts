import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.authService.validateToken()) {
      this.router.navigate(['/test-page']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this.authService.login(credentials).subscribe({
        next: (response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token); // Save token
            this.router.navigate(['/test-page']); // Redirect
          } else {
            alert('Invalid credentials');
          }
        },
        error: (error) => {
          console.error('Login error', error);
          if (error.error && error.error.error) {
            alert(error.error.error);
          } else {
            alert('An error occurred during login');
          }
        },
      });
    }
  }
}
