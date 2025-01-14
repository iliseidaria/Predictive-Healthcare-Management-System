import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorComponent } from './doctor.component';
import { AuthService } from '../../../services/auth/auth.service';
import { AppointmentService } from '../../../services/appointment/appointment.service';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ViewProfileButtonComponent } from '../../buttons/view-profile-button/view-profile-button.component';
import { LogoutButtonComponent } from '../../buttons/logout-button/logout-button.component';
import { User } from '../../../models/user'; // Import the User model
import { Appointment } from '../../../models/appointment'; // Import the Appointment model

describe('DoctorComponent', () => {
  let component: DoctorComponent;
  let fixture: ComponentFixture<DoctorComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockAppointmentService: jasmine.SpyObj<AppointmentService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['validateToken', 'getCurrentUser', 'getAuthHeaders']);
    mockAppointmentService = jasmine.createSpyObj('AppointmentService', ['getAppointments']);
    mockUserService = jasmine.createSpyObj('UserService', ['getUserById']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Mock methods
    mockAuthService.validateToken.and.returnValue(true);
    mockAuthService.getCurrentUser.and.returnValue({ id: '1', role: 'Doctor' });
    mockAppointmentService.getAppointments.and.returnValue(of([
      {
        appointmentId: '1',
        patientId: '123',
        providerId: '456',
        appointmentDate: new Date('2023-01-10T10:00:00Z'), // Use a Date object
        status: 0,
        reason: 'Checkup',
      } as Appointment,
      {
        appointmentId: '2',
        patientId: '124',
        providerId: '457',
        appointmentDate: new Date('2023-01-15T10:00:00Z'), // Use a Date object
        status: 0,
        reason: 'Consultation',
      } as Appointment,
    ]));


    mockUserService.getUserById.and.callFake((id: string) =>
      of({ id, firstName: `User${id}`, lastName: `Last${id}`, username: `user${id}`, email: `user${id}@example.com`, role: 'Patient' } as User)
    );

    await TestBed.configureTestingModule({
      imports: [CommonModule, DoctorComponent, ViewProfileButtonComponent, LogoutButtonComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: AppointmentService, useValue: mockAppointmentService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to login if token is not valid', () => {
    mockAuthService.validateToken.and.returnValue(false);
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should load appointments on init', () => {
    component.ngOnInit();
    expect(mockAppointmentService.getAppointments).toHaveBeenCalledWith(1, 10);
    expect(mockUserService.getUserById).toHaveBeenCalledTimes(2); // Two patients
    expect(component.upcomingAppointments.length).toBe(2);
    expect(component.upcomingAppointments[0].patientName).toBe('User123 Last123');
    expect(component.upcomingAppointments[1].patientName).toBe('User124 Last124');
  });

  it('should handle errors when loading appointments', () => {
    spyOn(console, 'error');
    mockAppointmentService.getAppointments.and.returnValue(throwError(() => new Error('Error loading appointments')));

    component.loadAppointments();

    expect(component.error).toBe('Failed to load appointments');
    expect(console.error).toHaveBeenCalledWith('Error:', jasmine.any(Error));
  });

  it('should navigate to profile page', () => {
    component.navigateToProfile();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/view-profile']);
  });

  it('should navigate to patients page', () => {
    component.navigateToPatients();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/get-all-patients']);
  });

  it('should navigate to appointments page', () => {
    component.navigateToAppointments();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/get-user-appointments']);
  });

  it('should navigate to all appointments page', () => {
    component.navigateToAllAppointments();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/get-all-appointments']);
  });

  it('should navigate to prescriptions page', () => {
    component.navigateToPrescriptions();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/get-user-prescriptions']);
  });

  it('should navigate to medical records page', () => {
    component.navigateToMedicalRecords();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/medical-records']);
  });

  it('should navigate to users page', () => {
    component.navigateToUsers();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/get-all-users']);
  });
});
