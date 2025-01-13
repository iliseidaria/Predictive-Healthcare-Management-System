import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentDetailComponent } from './appointment-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppointmentService } from '../../../../services/appointment/appointment.service';
import { PatientService } from '../../../../services/patient/patient.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { HttpHeaders } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Appointment, AppointmentStatus } from '../../../../models/appointment';

describe('AppointmentDetailComponent', () => {
  let component: AppointmentDetailComponent;
  let fixture: ComponentFixture<AppointmentDetailComponent>;
  let mockAppointmentService: jasmine.SpyObj<AppointmentService>;
  let mockPatientService: jasmine.SpyObj<PatientService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    // Mock AppointmentService
    mockAppointmentService = jasmine.createSpyObj('AppointmentService', [
      'getAppointmentById',
      'getStatusText',
    ]);
    // Mock PatientService
    mockPatientService = jasmine.createSpyObj('PatientService', [
      'getPatientById',
    ]);
    // Mock AuthService
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'validateToken',
      'getAuthHeaders',
    ]);
    // Mock NavigationService
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);

    // Mock method return values
    mockAuthService.validateToken.and.returnValue(true);
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders());
    mockAppointmentService.getAppointmentById.and.returnValue(
      of({
        patientId: '123',
        providerId: '456',
        appointmentDate: new Date(),
        reason: 'Checkup',
        status: AppointmentStatus.Scheduled,
      })
    );
    mockPatientService.getPatientById.and.returnValue(
      of({
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
        gender: 'Male',
      })
    );

    await TestBed.configureTestingModule({
      declarations: [AppointmentDetailComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: AppointmentService, useValue: mockAppointmentService },
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NavigationService, useValue: mockNavigationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch appointment details on init', () => {
    component.ngOnInit();
    expect(mockAuthService.validateToken).toHaveBeenCalled();
    expect(mockAppointmentService.getAppointmentById).toHaveBeenCalledWith('123');
    expect(component.appointment?.patientId).toEqual('123');
    expect(component.appointment?.reason).toEqual('Checkup');
  });

  it('should fetch patient details based on appointment', () => {
    component.loadAppointment('123');
    expect(mockPatientService.getPatientById).toHaveBeenCalledWith('123', {
      headers: new HttpHeaders(),
    });
    expect(component.appointment?.patientName).toEqual('John Doe');
  });

  it('should handle errors when fetching appointment fails', () => {
    mockAppointmentService.getAppointmentById.and.returnValue(throwError(() => new Error('Error loading appointment')));
    component.loadAppointment('invalid-id');
    expect(component.error).toEqual('Failed to load appointment');
    expect(component.loading).toBeFalse();
  });

  it('should handle errors when fetching patient details fails', () => {
    mockPatientService.getPatientById.and.returnValue(throwError(() => new Error('Error loading patient')));
    component.loadAppointment('123');
    expect(component.error).toEqual('Failed to load patient details');
    expect(component.loading).toBeFalse();
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockNavigationService.goBack).toHaveBeenCalled();
  });

  it('should display correct appointment status', () => {
    mockAppointmentService.getStatusText.and.returnValue('Scheduled');
    const status = component.getStatusText(AppointmentStatus.Scheduled);
    expect(status).toEqual('Scheduled');
    expect(mockAppointmentService.getStatusText).toHaveBeenCalledWith(AppointmentStatus.Scheduled);
  });
});
