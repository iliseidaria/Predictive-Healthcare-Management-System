import {Component, Injectable} from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import {LogoutButtonComponent} from '../buttons/logout-button/logout-button.component';
import {ViewProfileButtonComponent} from '../buttons/view-profile-button/view-profile-button.component';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [ViewProfileButtonComponent, LogoutButtonComponent, ViewProfileButtonComponent],
})

export class HeaderComponent {
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn(); // Replace with your actual method to check login status
  }
}
