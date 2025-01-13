import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentGetAllComponent } from './appointment-get-all.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppointmentService } from '../../../../services/appointment/appointment.service';
import { PatientService } from '../../../../services/patient/patient.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Appointment, AppointmentStatus } from '../../../../models/appointment';
import { HttpHeaders } from '@angular/common/http';

describe('AppointmentGetAllComponent', () => {
  let component: AppointmentGetAllComponent;
  let fixture: ComponentFixture<AppointmentGetAllComponent>;
  let mockAppointmentService: jasmine.SpyObj<AppointmentService>;
  let mockPatientService: jasmine.SpyObj<PatientService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    mockAppointmentService = jasmine.createSpyObj('AppointmentService', [
      'getAppointments',
      'getStatusText',
      'updateAppointmentStatus',
      'deleteAppointment'
    ]);
    mockPatientService = jasmine.createSpyObj('PatientService', ['getPatientById']);
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'validateToken',
      'getCurrentUser',
      'getAuthHeaders'
    ]);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);

    mockAuthService.validateToken.and.returnValue(true);
    mockAuthService.getCurrentUser.and.returnValue({ role: 'Doctor' });
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders());
    mockAppointmentService.getAppointments.and.returnValue(of([
      {
        appointmentId: '1',
        patientId: '123',
        providerId: '456',
        appointmentDate: new Date(),
        reason: 'Checkup',
        status: AppointmentStatus.Scheduled
      }
    ]));
    mockPatientService.getPatientById.and.returnValue(of({
      id: '123',
      firstName: 'John',
      lastName: 'Doe'
    }));

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule
      ],
      providers: [
        provideHttpClient(withFetch()),
        { provide: AppointmentService, useValue: mockAppointmentService },
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NavigationService, useValue: mockNavigationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentGetAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch appointments on init', () => {
    component.ngOnInit();
    expect(mockAuthService.validateToken).toHaveBeenCalled();
    expect(mockAppointmentService.getAppointments).toHaveBeenCalledWith(component.page, component.size);
    expect(mockPatientService.getPatientById).toHaveBeenCalledWith('123', { headers: new HttpHeaders() });
    expect(component.appointments.length).toBe(1);
    expect(component.appointments[0].patientName).toBe('John Doe');
  });

  it('should handle errors when loading appointments fails', () => {
    mockAppointmentService.getAppointments.and.returnValue(throwError(() => new Error('Failed to load appointments')));
    component.loadAppointments();
    expect(component.error).toBe('Failed to load appointments');
    expect(component.loading).toBeFalse();
  });

  it('should handle errors when loading patient details fails', () => {
    mockPatientService.getPatientById.and.returnValue(throwError(() => new Error('Failed to load patient details')));
    component.loadAppointments();
    expect(component.error).toBe('Failed to load patient details');
    expect(component.loading).toBeFalse();
  });

  it('should update appointment status', () => {
    const appointment: Appointment = {
      appointmentId: '1',
      patientId: '123',
      providerId: '456',
      appointmentDate: new Date(),
      reason: 'Checkup',
      status: AppointmentStatus.Scheduled
    };

    mockAppointmentService.updateAppointmentStatus.and.returnValue(of({ ...appointment, status: AppointmentStatus.Completed }));
    component.onStatusChange(appointment, AppointmentStatus.Completed);

    expect(mockAppointmentService.updateAppointmentStatus).toHaveBeenCalledWith('1', AppointmentStatus.Completed);
    expect(component.appointments[0].status).toBe(AppointmentStatus.Completed);
  });

  it('should handle errors when updating appointment status fails', () => {
    const appointment: Appointment = {
      appointmentId: '1',
      patientId: '123',
      providerId: '456',
      appointmentDate: new Date(),
      reason: 'Checkup',
      status: AppointmentStatus.Scheduled
    };

    spyOn(window, 'alert');
    mockAppointmentService.updateAppointmentStatus.and.returnValue(throwError(() => new Error('Failed to update status')));

    component.onStatusChange(appointment, AppointmentStatus.Completed);
    expect(mockAppointmentService.updateAppointmentStatus).toHaveBeenCalledWith('1', AppointmentStatus.Completed);
    expect(window.alert).toHaveBeenCalledWith('Failed to update appointment status');
  });

  it('should delete an appointment', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockAppointmentService.deleteAppointment.and.returnValue(of(void 0));
    component.deleteAppointment('1');
    expect(mockAppointmentService.deleteAppointment).toHaveBeenCalledWith('1');
    expect(component.appointments.length).toBe(0);
  });

  it('should handle errors when deleting an appointment fails', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockAppointmentService.deleteAppointment.and.returnValue(throwError(() => new Error('Failed to delete appointment')));
    component.deleteAppointment('1');
    expect(mockAppointmentService.deleteAppointment).toHaveBeenCalledWith('1');
  });

  it('should determine if it is the last page', () => {
    component.totalCount = 10;
    component.page = 1;
    component.size = 5;
    expect(component.isLastPage()).toBeFalse();

    component.page = 2;
    expect(component.isLastPage()).toBeTrue();
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockNavigationService.goBack).toHaveBeenCalled();
  });
});
