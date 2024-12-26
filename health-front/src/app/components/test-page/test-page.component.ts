import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css',
  standalone: true,
  imports: [CommonModule]
})
export class TestPageComponent {
  constructor(private router: Router, public authService: AuthService) {}

  // Navigate to a specific route only if the user is authenticated
  navigateTo(path: string) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate([path]);
    } else {
      alert('You must be logged in to access this page.');
      this.router.navigate(['/login']);
    }
  }

  logout() {
    if (this.authService.isAuthenticated()) {
      this.authService.logout().subscribe({
        next: () => {
          console.log('Logout successful');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Logout error:', err);
          // Still remove token and redirect on error
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadProfile() {
    if (this.authService.isAuthenticated()) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        alert(`Profile Information:\nUsername: ${currentUser.username}\nEmail: ${currentUser.email}`);
      } else {
        alert('Could not load profile information.');
      }
    } else {
      alert('You must be logged in to view your profile.');
      this.router.navigate(['/login']);
    }
  }
}
