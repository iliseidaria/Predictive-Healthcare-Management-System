import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class UserDetailComponent implements OnInit {
  username: string = '';
  email: string = '';
  role: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.validateToken()) {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.username = user.username;
        this.email = user.email;
        this.role = user.role;
      }
    } else {
      this.errorMessage = 'Invalid or expired token. Please log in again.';
      this.router.navigate(['/login']);
    }
  }
}
