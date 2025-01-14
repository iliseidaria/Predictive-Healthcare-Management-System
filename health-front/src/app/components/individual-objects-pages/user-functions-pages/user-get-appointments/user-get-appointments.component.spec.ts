import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserGetAppointmentsComponent } from './user-get-appointments.component';
import { AppointmentService } from '../../../../services/appointment/appointment.service';
import { PatientService } from '../../../../services/patient/patient.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { Appointment, AppointmentStatus } from '../../../../models/appointment';

// Extend Appointment interface to include additional testing properties
interface ExtendedAppointment extends Appointment {
  doctorName?: string;
  patientName?: string;
}

describe('UserGetAppointmentsComponent', () => {
  let component: UserGetAppointmentsComponent;
  let fixture: ComponentFixture<UserGetAppointmentsComponent>;
  let mockAppointmentService: jasmine.SpyObj<AppointmentService>;
  let mockPatientService: jasmine.SpyObj<PatientService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    // Mock services
    mockAppointmentService = jasmine.createSpyObj('AppointmentService', ['getAppointments', 'getStatusText']);
    mockPatientService = jasmine.createSpyObj('PatientService', ['getPatientById']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['validateToken', 'getCurrentUser', 'getAuthHeaders']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);

    // Mock method behaviors
    mockAuthService.validateToken.and.returnValue(true);
    mockAuthService.getCurrentUser.and.returnValue({ id: '1', username: 'doctor1', role: 'Doctor' });
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders({ Authorization: 'Bearer token' }));

    mockAppointmentService.getAppointments.and.returnValue(
      of([
        {
          appointmentId: '1',
          patientId: '101',
          providerId: '1',
          appointmentDate: new Date(), // Use Date object
          reason: 'Checkup',
          status: AppointmentStatus.Scheduled
        },
        {
          appointmentId: '2',
          patientId: '102',
          providerId: '1',
          appointmentDate: new Date(new Date().getTime() + 3600000), // Use Date object
          reason: 'Consultation',
          status: AppointmentStatus.Completed
        }
      ] as Appointment[])
    );

    mockPatientService.getPatientById.and.callFake((id: string) =>
      of({ id, firstName: `Patient${id}`, lastName: `Last${id}` })
    );

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule, FormsModule],
      declarations: [UserGetAppointmentsComponent],
      providers: [
        { provide: AppointmentService, useValue: mockAppointmentService },
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: NavigationService, useValue: mockNavigationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserGetAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load appointments on init', () => {
    component.ngOnInit();
    expect(mockAppointmentService.getAppointments).toHaveBeenCalledWith(1, 10);
    expect(mockPatientService.getPatientById).toHaveBeenCalledTimes(4); // 2 patients + 2 providers
    expect(component.appointments.length).toBe(2);

    // Test added properties
    expect((component.appointments[0] as ExtendedAppointment).patientName).toBe('Patient101 Last101');
    expect((component.appointments[0] as ExtendedAppointment).doctorName).toBe('Patient1 Last1');
  });

  it('should handle errors during appointment loading', () => {
    spyOn(console, 'error');
    mockAppointmentService.getAppointments.and.returnValue(throwError(() => new Error('Error loading appointments')));

    component.loadAppointments();

    expect(component.error).toBe('Failed to load appointments');
    expect(console.error).toHaveBeenCalledWith('Error:', jasmine.any(Error));
  });

  it('should handle errors during patient/provider details loading', () => {
    spyOn(console, 'error');
    mockPatientService.getPatientById.and.returnValue(throwError(() => new Error('Error fetching user details')));

    component.loadAppointments();

    expect(component.error).toBe('Failed to load user details');
    expect(console.error).toHaveBeenCalledWith('Error loading user details:', jasmine.any(Error));
  });

  it('should correctly determine the last page', () => {
    component.totalCount = 20;
    component.page = 2;
    component.size = 10;
    expect(component.isLastPage()).toBeTrue();

    component.page = 1;
    expect(component.isLastPage()).toBeFalse();
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockNavigationService.goBack).toHaveBeenCalled();
  });

  it('should return the correct status text', () => {
    mockAppointmentService.getStatusText.and.returnValue('Scheduled');
    const statusText = component.getStatusText(AppointmentStatus.Scheduled);
    expect(statusText).toBe('Scheduled');
    expect(mockAppointmentService.getStatusText).toHaveBeenCalledWith(AppointmentStatus.Scheduled);
  });
});
