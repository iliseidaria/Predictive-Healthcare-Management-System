import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css',
  standalone: true,
  imports: [CommonModule]
})
export class TestPageComponent implements OnInit, OnDestroy {
  private tokenCheckSubscription?: Subscription;

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit() {
    // Check token every minute
    this.tokenCheckSubscription = interval(60000).subscribe(() => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = payload.exp * 1000; // Convert to milliseconds
          if (Date.now() >= expirationTime) {
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
          }
        } catch (error) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.tokenCheckSubscription) {
      this.tokenCheckSubscription.unsubscribe();
    }
  }

  isAdmin(): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.role === 'Admin') {
      return true;
    } else {
      return false;
    }
  }

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
      if (currentUser && (currentUser.username || currentUser.email)) {
        alert(`Profile Information:
              Username: ${currentUser.username || 'Not available'}
              Email: ${currentUser.email || 'Not available'}
              Role: ${currentUser.role || 'Not available'}`
        );
      } else {
        alert('Could not load profile information. Token may be invalid.');
      }
    } else {
      alert('You must be logged in to view your profile.');
      this.router.navigate(['/login']);
    }
  }
}
