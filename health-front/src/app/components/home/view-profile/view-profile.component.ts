import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Importă FormsModule pentru ngModel
import { Gender, User } from '../../../models/user';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]  // Adaugă FormsModule pentru ngModel
})
export class ViewProfileComponent implements OnInit {
  user: any = null;
  Gender = Gender;
  error: string | null = null;
  loading: boolean = false;
  isEditing: boolean = false;  // Variabila care controlează formularul de editare

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.error = 'User not authenticated.';
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.userService.getUserById(currentUser.id, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (response) => {
        this.user = {
          ...response,
          dateOfBirth: this.formatDate(response.dateOfBirth),
          // gender: parseInt(this.user.gender, 10)
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.error = 'Failed to load profile.';
        this.loading = false;
      }
    });
  }

  enableEdit(): void {
    this.isEditing = true;  // Activează formularul de editare
  }

  cancelEdit(): void {
    this.isEditing = false;  // Dezactivează formularul de editare
    this.loadProfile();  // Reîncarcă datele pentru a anula modificările
  }

  private formatDate(date: string): string {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = parsedDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  saveProfile(): void {
    this.loading = true;

    if (!this.user) return;
    
    const updateData = {
      ...this.user,
      gender: parseInt(this.user.gender, 10)
    };

    this.userService.updateUser(this.user.id, updateData, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (response) => {
        this.user = response;
        this.isEditing = false;  // După salvarea datelor, se iese din modul de editare
        this.loading = false;
      },
      error: (error) => {
        console.error('Error saving profile:', error);
        this.error = 'Failed to save profile.';
        this.loading = false;
      }
    });
  }

  goBack() {
    if (this.user.role === 'doctor') {
      this.router.navigate(['/doctor']);
    } else {
      this.router.navigate(['/test-page']);
    }
  }  
}