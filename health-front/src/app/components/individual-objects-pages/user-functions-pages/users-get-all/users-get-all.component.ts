import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../../services/user/user.service';
import { User, UserRole, UsersResponse } from '../../../../models/user';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { PatientService } from '../../../../services/patient/patient.service';

@Component({
  selector: 'app-users-get-all',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [NavigationService],
  templateUrl: './users-get-all.component.html',
  styleUrl: './users-get-all.component.css'
})
export class UsersGetAllComponent implements OnInit {
  users: User[] = [];
  page: number = 1;
  size: number = 10;
  totalCount: number = 0;
  loading: boolean = false;
  error: string | null = null;
  private navigationService = inject(NavigationService);

  constructor(
    private patientService: PatientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    console.log('Loading users...');
    
    this.patientService.getAllUsers(this.page, this.size, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (response: UsersResponse) => {
        console.log('API Response:', response);
        if (response && response.items) {
          this.users = response.items;
          this.totalCount = response.totalCount;
          console.log('Loaded users:', this.users);
        } else {
          console.error('Invalid response format:', response);
          this.error = 'Invalid response format';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.error = 'Failed to load users';
        this.loading = false;
      }
    });
}
  isLastPage(): boolean {
    return (this.page * this.size) >= this.totalCount;
  }

  deleteUser(userId: string): void {
    if (!userId || !confirm('Are you sure you want to delete this user?')) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.patientService.deletePatient(userId, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        this.error = 'Failed to delete user';
        this.loading = false;
        console.error('Error deleting user:', error);
      }
    });
  }

  goBack(): void {
    this.navigationService.goBack();
  }
}
