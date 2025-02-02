import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { UserRole } from '../../../../models/user';
import { PatientService } from '../../../../services/patient/patient.service';

interface UpdateUserData {
  userId: string;
  username: string;
  email: string;
  role: string;
}

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
    private patientService: PatientService,
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
    this.patientService.getPatientById(this.userId, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (user) => {
        console.log('Current user role:', user.role);
        this.userForm.patchValue({
          username: user.username,
          email: user.email,
          role: user.role
        });
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const updateData: UpdateUserData = {
        userId: this.userId,
        username: this.userForm.value.username,
        email: this.userForm.value.email,
        role: this.userForm.value.role
      };

      console.log('Update data being sent:', updateData);

      this.patientService.updateUser(this.userId, updateData, {
        headers: this.authService.getAuthHeaders()
      }).subscribe({
        next: () => {
          alert('User updated successfully');
          this.router.navigate(['/get-all-users']);
        },
        error: (error) => {
          console.error('Error updating user:', error);
          alert('Failed to update user: ' + error.message);
        }
      });
    }
  }

  goBack(): void {
    this.navigationService.goBack();
  }
}
