import { Component } from '@angular/core';
import {RouterLink, RouterOutlet, Router} from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class TestPageComponent {
  constructor(private router: Router, public authService: AuthService) {}

  // Navigate to a specific route only if the user is authenticated
  navigateTo(path: string) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate([path]);
    } else {
      alert('You must be logged in to access this page.');
      this.router.navigate(['/login']);  // Redirect to login page if not authenticated
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login');
      },
      error: (err) => console.error('Error during logout:', err),
    });
  }

  // Optional: Check if the user has a certain role before performing an action
  // hasAdminAccess(): boolean {
  //   return this.authService.hasRole('Admin');
  // }
}
