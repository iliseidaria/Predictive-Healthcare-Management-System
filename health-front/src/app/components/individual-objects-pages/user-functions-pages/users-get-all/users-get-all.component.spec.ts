import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersGetAllComponent } from './users-get-all.component';
import { PatientService } from '../../../../services/patient/patient.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersResponse, User, UserRole } from '../../../../models/user';
import { HttpHeaders } from '@angular/common/http';

describe('UsersGetAllComponent', () => {
  let component: UsersGetAllComponent;
  let fixture: ComponentFixture<UsersGetAllComponent>;
  let mockPatientService: jasmine.SpyObj<PatientService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    // Mock PatientService and AuthService
    mockPatientService = jasmine.createSpyObj('PatientService', ['getAllUsers', 'deletePatient']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getAuthHeaders']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);

    // Mock methods
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders({ Authorization: 'Bearer token' }));
    mockPatientService.getAllUsers.and.returnValue(
      of({
        items: [
          { id: '1', username: 'user1', email: 'user1@example.com', role: UserRole.Patient, firstName: 'John', lastName: 'Doe' },
          { id: '2', username: 'user2', email: 'user2@example.com', role: UserRole.Doctor, firstName: 'Jane', lastName: 'Smith' }
        ],
        totalCount: 2,
        pageNumber: 1,
        pageSize: 10
      } as UsersResponse)
    );
    mockPatientService.deletePatient.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule],
      declarations: [UsersGetAllComponent],
      providers: [
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NavigationService, useValue: mockNavigationService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersGetAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    component.ngOnInit();
    expect(mockPatientService.getAllUsers).toHaveBeenCalledWith(component.page, component.size, {
      headers: new HttpHeaders({ Authorization: 'Bearer token' })
    });
    expect(component.users.length).toBe(2);
    expect(component.totalCount).toBe(2);
  });

  it('should handle error during user loading', () => {
    spyOn(console, 'error');
    mockPatientService.getAllUsers.and.returnValue(throwError(() => new Error('Error loading users')));

    component.loadUsers();

    expect(component.error).toBe('Failed to load users');
    expect(component.loading).toBeFalse();
    expect(console.error).toHaveBeenCalled();
  });

  it('should delete a user and reload the list', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteUser('1');

    expect(mockPatientService.deletePatient).toHaveBeenCalledWith('1', {
      headers: new HttpHeaders({ Authorization: 'Bearer token' })
    });
    expect(mockPatientService.getAllUsers).toHaveBeenCalled();
  });

  it('should handle error during user deletion', () => {
    spyOn(console, 'error');
    spyOn(window, 'confirm').and.returnValue(true);
    mockPatientService.deletePatient.and.returnValue(throwError(() => new Error('Error deleting user')));

    component.deleteUser('1');

    expect(component.error).toBe('Failed to delete user');
    expect(console.error).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should not delete a user if confirmation is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteUser('1');

    expect(mockPatientService.deletePatient).not.toHaveBeenCalled();
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockNavigationService.goBack).toHaveBeenCalled();
  });

  it('should correctly determine the last page', () => {
    component.totalCount = 20;
    component.page = 2;
    component.size = 10;
    expect(component.isLastPage()).toBeTrue();

    component.page = 1;
    expect(component.isLastPage()).toBeFalse();
  });
});
