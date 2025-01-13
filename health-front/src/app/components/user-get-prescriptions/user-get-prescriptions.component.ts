import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PrescriptionService } from '../../services/prescription/prescription.service';
import { AuthService } from '../../services/auth/auth.service';
import { NavigationService } from '../../services/navigation/navigation.service';
import { Prescription } from '../../models/prescription';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-get-prescriptions',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-get-prescriptions.component.html',
  styleUrl: './user-get-prescriptions.component.css',
  providers: [NavigationService]
})
export class UserGetPrescriptionsComponent implements OnInit {
  prescriptions: Prescription[] = [];
  page: number = 1;
  size: number = 10;
  totalCount: number = 0;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private prescriptionService: PrescriptionService,
    private router: Router,
    private authService: AuthService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.loadPrescriptions();
  }

  loadPrescriptions(): void {
    if (!this.authService.validateToken()) {
      this.router.navigate(['/login']);
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.error = 'User information not found';
      return;
    }

    this.loading = true;
    this.prescriptionService.getPrescriptionsByPatientId(currentUser.id, this.page, this.size, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (response) => {
        this.prescriptions = response.items;
        this.totalCount = response.totalCount;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load prescriptions:', error);
        this.error = 'Failed to load prescriptions';
        this.loading = false;
      }
    });
  }

  isLastPage(): boolean {
    return (this.page * this.size) >= this.totalCount;
  }

  goBack(): void {
    this.navigationService.goBack();
  }
}