import {Component, Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.css'],
  standalone: true,
})
export class LogoutButtonComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout(); // Implement this in your AuthService
    this.router.navigate(['/login']); // Redirect to the login page
  }
}
