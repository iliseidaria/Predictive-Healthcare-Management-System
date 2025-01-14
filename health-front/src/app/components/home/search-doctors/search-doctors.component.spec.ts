import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchDoctorsComponent } from './search-doctors.component';
import { DoctorService } from '../../../services/doctor/doctor.service';
import { AuthService } from '../../../services/auth/auth.service';
import { NavigationService } from '../../../services/navigation/navigation.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpHeaders } from '@angular/common/http'; // Import HttpHeaders

describe('SearchDoctorsComponent', () => {
  let component: SearchDoctorsComponent;
  let fixture: ComponentFixture<SearchDoctorsComponent>;
  let mockDoctorService: jasmine.SpyObj<DoctorService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    // Mock services
    mockDoctorService = jasmine.createSpyObj('DoctorService', ['getAllDoctors', 'searchDoctors', 'deleteDoctor']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['validateToken', 'getCurrentUser', 'getAuthHeaders']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);

    // Mock methods
    mockAuthService.validateToken.and.returnValue(true);
    mockAuthService.getCurrentUser.and.returnValue({ role: 'admin' });
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders({ Authorization: 'Bearer token' }));
    mockDoctorService.getAllDoctors.and.returnValue(
      of({ items: [{ id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' }], totalCount: 1 })
    );
    mockDoctorService.searchDoctors.and.returnValue(
      of({ items: [{ id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' }], totalCount: 1 })
    );

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterLink, SearchDoctorsComponent],
      providers: [
        { provide: DoctorService, useValue: mockDoctorService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NavigationService, useValue: mockNavigationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load doctors on init', () => {
    component.ngOnInit();
    expect(mockDoctorService.getAllDoctors).toHaveBeenCalledWith(component.page, component.size, { headers: mockAuthService.getAuthHeaders() });
    expect(component.doctors.length).toBe(1);
    expect(component.totalCount).toBe(1);
  });

  it('should filter doctors based on search term', () => {
    component.searchTerm = 'Jane';
    component.filterDoctors();
    expect(mockDoctorService.searchDoctors).toHaveBeenCalledWith('Jane', component.page, component.size, { headers: mockAuthService.getAuthHeaders() });
    expect(component.doctors.length).toBe(1);
    expect(component.doctors[0].firstName).toBe('Jane');
  });

  it('should reload doctors if search term is empty', () => {
    component.searchTerm = '';
    component.filterDoctors();
    expect(mockDoctorService.getAllDoctors).toHaveBeenCalledWith(component.page, component.size, { headers: mockAuthService.getAuthHeaders() });
  });

  it('should delete a doctor by ID', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockDoctorService.deleteDoctor.and.returnValue(of({}));

    component.deleteDoctor('1');

    expect(mockDoctorService.deleteDoctor).toHaveBeenCalledWith('1', { headers: mockAuthService.getAuthHeaders() });
    expect(mockDoctorService.getAllDoctors).toHaveBeenCalled();
  });

  it('should handle error when loading doctors', () => {
    spyOn(console, 'error');
    mockDoctorService.getAllDoctors.and.returnValue(throwError(() => new Error('Error loading doctors')));
    component.loadDoctors();
    expect(component.error).toBe('Failed to load doctors');
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle error when searching for doctors', () => {
    spyOn(console, 'error');
    mockDoctorService.searchDoctors.and.returnValue(throwError(() => new Error('Error searching doctors')));
    component.searchTerm = 'Test';
    component.filterDoctors();
    expect(component.error).toBe('No doctors found');
    expect(console.error).toHaveBeenCalled();
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockNavigationService.goBack).toHaveBeenCalled();
  });
});
