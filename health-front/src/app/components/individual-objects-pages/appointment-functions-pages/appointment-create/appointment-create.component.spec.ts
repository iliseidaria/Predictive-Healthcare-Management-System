import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentCreateComponent } from './appointment-create.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../../services/appointment/appointment.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Appointment, AppointmentResponse, AppointmentStatus } from '../../../../models/appointment';

describe('AppointmentCreateComponent', () => {
  let component: AppointmentCreateComponent;
  let fixture: ComponentFixture<AppointmentCreateComponent>;
  let mockAppointmentService: jasmine.SpyObj<AppointmentService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    // Create spies for all dependencies
    mockAppointmentService = jasmine.createSpyObj('AppointmentService', ['createAppointment']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'validateToken']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);

    // Mock method return values
    mockAuthService.getCurrentUser.and.returnValue({ id: '123', role: 'Doctor' });
    mockAuthService.validateToken.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        provideHttpClient(withFetch()),
        { provide: AppointmentService, useValue: mockAppointmentService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: NavigationService, useValue: mockNavigationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with required fields', () => {
    const form = component.appointmentForm;
    expect(form).toBeTruthy();
    expect(form.get('patientId')?.value).toBe('');
    expect(form.get('appointmentDate')?.value).toBe('');
    expect(form.get('appointmentTime')?.value).toBe('');
    expect(form.get('reason')?.value).toBe('');
  });

  it('should call goBack when goBack is invoked', () => {
    component.goBack();
    expect(mockNavigationService.goBack).toHaveBeenCalled();
  });

  it('should not submit if form is invalid', () => {
    component.appointmentForm.patchValue({
      patientId: '',
      appointmentDate: '',
      appointmentTime: '',
      reason: '',
    });

    component.onSubmit();

    expect(mockAppointmentService.createAppointment).not.toHaveBeenCalled();
  });

  it('should alert if user role is "Patient"', () => {
    spyOn(window, 'alert');
    mockAuthService.getCurrentUser.and.returnValue({ id: '123', role: 'Patient' });

    component.appointmentForm.patchValue({
      patientId: '456',
      appointmentDate: '2025-01-01',
      appointmentTime: '10:00',
      reason: 'Checkup',
    });

    component.onSubmit();

    expect(mockAppointmentService.createAppointment).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Provider ID not available. Please log in again.');
  });

  it('should submit form and call createAppointment', () => {
    const appointmentResponse: AppointmentResponse = {
      id: '789',
      patientId: '456',
      providerId: '123',
      appointmentDate: new Date('2025-01-01T10:00'),
      reason: 'Checkup',
      status: AppointmentStatus.Scheduled,
    };
    mockAppointmentService.createAppointment.and.returnValue(of(appointmentResponse));

    component.appointmentForm.patchValue({
      patientId: '456',
      appointmentDate: '2025-01-01',
      appointmentTime: '10:00',
      reason: 'Checkup',
    });

    component.onSubmit();

    expect(mockAppointmentService.createAppointment).toHaveBeenCalledWith({
      patientId: '456',
      providerId: '123',
      appointmentDate: new Date('2025-01-01T10:00'),
      reason: 'Checkup',
      status: AppointmentStatus.Scheduled,
    });
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/appointment-detail/789');
  });

  it('should handle errors during appointment creation', () => {
    spyOn(window, 'alert');
    mockAppointmentService.createAppointment.and.returnValue(throwError(() => new Error('API error')));

    component.appointmentForm.patchValue({
      patientId: '456',
      appointmentDate: '2025-01-01',
      appointmentTime: '10:00',
      reason: 'Checkup',
    });

    component.onSubmit();

    expect(mockAppointmentService.createAppointment).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Failed to create appointment');
  });
});
