import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User, UserRole } from '../../models/user';
import { AuthService } from '../../services/auth/auth.service';
import { NavigationService } from '../../services/navigation/navigation.service';

@Component({
  selector: 'app-users-get-all',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers(this.page, this.size, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (response) => {
        this.users = response.items;
        this.totalCount = response.totalCount;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  isLastPage(): boolean {
    return (this.page * this.size) >= this.totalCount;
  }
  
  deleteUser(userId: string): void {
    if (!userId) return;

    if (confirm('Are you sure you want to delete this user?')) {
      this.loading = true;
      this.error = null;

      this.userService.deleteUser(userId, {
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
  }

  goBack(): void {
    this.navigationService.goBack();
  }
}