import { Component, OnInit, inject } from '@angular/core';
import { DoctorService } from '../../../services/doctor/doctor.service';
import { AuthService } from '../../../services/auth/auth.service';
import { NavigationService } from '../../../services/navigation/navigation.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // pentru ngModel

@Component({
  selector: 'app-search-doctors',
  templateUrl: './search-doctors.component.html',
  styleUrls: ['./search-doctors.component.css'],
  imports: [CommonModule, RouterLink, FormsModule], // Include FormsModule pentru ngModel
  standalone: true,
  providers: [NavigationService],
})
export class SearchDoctorsComponent implements OnInit {
  doctors: any[] = [];
  searchTerm: string = '';
  page = 1;
  size = 10;
  totalCount = 0;
  error: string | null = null;
  private navigationService = inject(NavigationService);

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadDoctors(); // Inițializăm încărcarea doctorilor
  }

  /**
   * Verifică dacă este ultima pagină
   */
  isLastPage(): boolean {
    return this.page * this.size >= this.totalCount;
  }

  /**
   * Încarcă doctorii din API
   */
  loadDoctors() {
    if (!this.authService.validateToken() || this.authService.getCurrentUser().role === 'patient') {
      return;
    }

    const headers = this.authService.getAuthHeaders();

    // Preluăm doctorii din API
    this.doctorService.getAllDoctors(this.page, this.size, { headers }).subscribe({
      next: (data) => {
        console.log('Filtered doctor data:', data.items);
        this.doctors = data.items;
        this.totalCount = data.totalCount;
      },
      error: (err) => {
        console.error('Error loading doctors:', err);
        this.error = 'Failed to load doctors';
      },
    });
  }

  /**
   * Filtrează doctorii pe baza unui termen de căutare
   */
  filterDoctors() {
    if (!this.searchTerm.trim()) {
      this.loadDoctors(); // Dacă nu există termen de căutare, reîncarcă doctorii
      return;
    }
  
    const headers = this.authService.getAuthHeaders();
    console.log('Searching for doctors with term:', this.searchTerm);  // Logare termenul de căutare
  
    this.doctorService.searchDoctors(this.searchTerm, this.page, this.size, { headers }).subscribe({
      next: (data) => {
        console.log('Doctor search response:', data);  // Logare răspunsul de la API
        if (data && data.items) {
          this.doctors = data.items;
          this.totalCount = data.totalCount;
        } else {
          console.log('No doctors found in the response.');
        }
      },
      error: (err) => {
        console.error('Error searching doctors:', err);
        this.error = 'No doctors found';
      },
    });
  }

  /**
   * Șterge un doctor
   */
  deleteDoctor(id: string) {
    if (!id) {
      console.error('No doctor ID provided');
      return;
    }
    if (confirm('Are you sure you want to delete this doctor?')) {
      const headers = this.authService.getAuthHeaders();
      this.doctorService.deleteDoctor(id, { headers }).subscribe({
        next: () => {
          alert('Doctor deleted successfully');
          this.loadDoctors();
        },
        error: (err) => console.error(err),
      });
    }
  }
  
  searchDoctors(): void {
    const headers = this.authService.getAuthHeaders();
    this.doctorService.searchDoctors(this.searchTerm, this.page, this.size, { headers }).subscribe({
      next: (response) => {
        if (response && response.items) {
          this.doctors = response.items.filter((doctor: any) => doctor.role === 'doctor').map((doctor: any) => ({
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            contactInformation: doctor.contactInformation,
            email: doctor.email
          }));
          this.totalCount = response.totalCount;
        } else {
          console.error('No doctors found or wrong response structure');
        }
      },
      error: (err) => {
        console.error('Error loading doctors:', err);
      }
    });
  }


  goBack(): void {
    this.navigationService.goBack();
  }
}