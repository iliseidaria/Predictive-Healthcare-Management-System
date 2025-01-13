import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user/user.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { UserRole } from '../../../../models/user';

@Component({
  selector: 'app-user-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css'],
  providers: [NavigationService]
})
export class UserUpdateComponent implements OnInit {
  userForm: FormGroup;
  userId!: string;
  roles = Object.values(UserRole);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private navigationService: NavigationService
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.userService.getUserById(this.userId, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (user) => {
        this.userForm.patchValue(user);
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.userService.updateUser(this.userId, this.userForm.value, {
        headers: this.authService.getAuthHeaders()
      }).subscribe({
        next: () => {
          alert('User updated successfully');
          this.router.navigate(['/get-all-users']);
        },
        error: (error) => {
          console.error('Error updating user:', error);
          alert('Failed to update user');
        }
      });
    }
  }

  goBack(): void {
    this.navigationService.goBack();
  }
}
