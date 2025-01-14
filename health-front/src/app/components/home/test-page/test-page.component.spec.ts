import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestPageComponent } from './test-page.component';
import { AuthService } from '../../../services/auth/auth.service';
import { AppointmentService } from '../../../services/appointment/appointment.service';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ViewProfileButtonComponent } from '../../buttons/view-profile-button/view-profile-button.component';
import { LogoutButtonComponent } from '../../buttons/logout-button/logout-button.component';
import { HttpHeaders } from '@angular/common/http';

describe('TestPageComponent', () => {
  let component: TestPageComponent;
  let fixture: ComponentFixture<TestPageComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockAppointmentService: jasmine.SpyObj<AppointmentService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['validateToken', 'getCurrentUser', 'getAuthHeaders', 'logout', 'handleLogout']);
    mockAppointmentService = jasmine.createSpyObj('AppointmentService', ['getAppointments']);
    mockUserService = jasmine.createSpyObj('UserService', ['getUserById']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockAuthService.validateToken.and.returnValue(true);
    mockAuthService.getCurrentUser.and.returnValue({ role: 'admin', username: 'admin', email: 'admin@example.com' });
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders({ Authorization: 'Bearer token' }));
    mockAppointmentService.getAppointments.and.returnValue(of([]));
    mockUserService.getUserById.and.returnValue(
      of({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        role: 'Patient',
      })
    );

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterLink, ViewProfileButtonComponent, LogoutButtonComponent],
      declarations: [TestPageComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: AppointmentService, useValue: mockAppointmentService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login if token is invalid on init', () => {
    mockAuthService.validateToken.and.returnValue(false);
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should load appointments on init', () => {
    component.ngOnInit();
    expect(mockAppointmentService.getAppointments).toHaveBeenCalled();
  });

  it('should handle error when loading appointments', () => {
    spyOn(console, 'error');
    mockAppointmentService.getAppointments.and.returnValue(throwError(() => new Error('Error loading appointments')));
    component.loadAppointments();
    expect(component.error).toBe('Failed to load appointments');
    expect(console.error).toHaveBeenCalled();
  });

  it('should navigate to a specific path if user is authenticated', () => {
    component.navigateTo('/some-path');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/some-path']);
  });

  it('should alert and navigate to login if user is not authenticated', () => {
    mockAuthService.validateToken.and.returnValue(false);
    spyOn(window, 'alert');
    component.navigateTo('/some-path');
    expect(window.alert).toHaveBeenCalledWith('You must be logged in to access this page.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should logout and navigate to login', () => {
    mockAuthService.logout.and.returnValue(of({}));
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle error during logout', () => {
    spyOn(console, 'error');
    mockAuthService.logout.and.returnValue(throwError(() => new Error('Logout error')));
    component.logout();
    expect(mockAuthService.handleLogout).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it('should load profile information', () => {
    spyOn(window, 'alert');
    component.loadProfile();
    expect(window.alert).toHaveBeenCalledWith(`Profile Information:
              Username: admin
              Email: admin@example.com
              Role: admin`);
  });

  it('should alert and navigate to login if token is invalid when loading profile', () => {
    mockAuthService.validateToken.and.returnValue(false);
    spyOn(window, 'alert');
    component.loadProfile();
    expect(window.alert).toHaveBeenCalledWith('You must be logged in to view your profile.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to medical records', () => {
    component.viewMedicalHistory();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/medical-records']);
  });

  it('should navigate to prescriptions', () => {
    component.viewPrescriptions();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/prescriptions/my']);
  });

  it('should navigate to health risks', () => {
    component.viewHealthRisks();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/health-risks']);
  });

  it('should navigate to search doctors', () => {
    component.searchDoctors();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/search-doctors']);
  });

  it('should navigate to profile', () => {
    component.navigateToProfile();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/view-profile']);
  });
});
