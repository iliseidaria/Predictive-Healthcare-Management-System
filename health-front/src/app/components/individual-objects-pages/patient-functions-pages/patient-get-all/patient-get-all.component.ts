import { Component, OnInit, inject } from '@angular/core';
import { PatientService } from '../../../../services/patient/patient.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { Router, RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../../../services/navigation/navigation.service';

@Component({
  selector: 'app-patient-get-all',
  templateUrl: './patient-get-all.component.html',
  styleUrl: './patient-get-all.component.css',
  imports: [
    CommonModule,
    RouterLink
  ],
  standalone: true,
  providers: [NavigationService]
})
export class PatientGetAllComponent implements OnInit {
  patients: any[] = [];
  page = 1;
  size = 10;
  totalCount = 0;
  userRole: string = '';
  error: string | null = null;
  user: any[] = [];
  private navigationService = inject(NavigationService);

  constructor(private patientService: PatientService, private authService: AuthService, private router: Router) {}
  
  ngOnInit() {
    this.userRole = this.authService.getCurrentUser().role || ''; //pentru html
    this.loadPatients();
  }

  isLastPage(): boolean {
    return this.page * this.size >= this.totalCount;
  }

  loadPatients() {
    if (!this.authService.validateToken() || this.authService.getCurrentUser().role === 'patient') {
      return;
    }
  
    const headers = this.authService.getAuthHeaders();
    
    // First get all users with role 'patient'
    this.patientService.getAllPatients(this.page, this.size, { headers }).subscribe({
      next: (data) => {
        // Filter users with role 'patient'
        const patientUsers = data.items.filter((user: any) => user.role === 'patient');
        
        console.log('Filtered patient data:', patientUsers);
        this.patients = patientUsers;
        this.totalCount = patientUsers.length;
      },
      error: (err) => {
        console.error('Error loading patients:', err);
        this.error = 'Failed to load patients';
      }
    });
  }

  deletePatient(id: string) {
    if (!id) {
      console.error('No patient ID provided');
      return;
    }
    if (confirm('Are you sure you want to delete this patient?')) {
      const headers = this.authService.getAuthHeaders();
      this.patientService.deletePatient(id, { headers }).subscribe({
        next: () => {
          alert('Patient deleted successfully');
          this.loadPatients();
        },
        error: (err) => console.error(err),
      });
    }
  }

  createMedicalRecord(patientId: string): void {
  console.log(`Creating medical record for patient ID: ${patientId}`);
  this.router.navigate(['/create-medical-record', patientId]);
}

  goBack(): void {
    this.navigationService.goBack();
  }
}
