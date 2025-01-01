import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentDetailComponent } from './appointment-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppointmentService } from '../../services/appointment/appointment.service';
import { PatientService } from '../../services/patient/patient.service';
import { AuthService } from '../../services/auth/auth.service';
import { NavigationService } from '../../services/navigation/navigation.service';
import { HttpHeaders, provideHttpClient, withFetch } from '@angular/common/http';
import { of } from 'rxjs';
import { AppointmentStatus } from '../../models/appointment';

describe('AppointmentDetailComponent', () => {
  let component: AppointmentDetailComponent;
  let fixture: ComponentFixture<AppointmentDetailComponent>;
  let mockAppointmentService: jasmine.SpyObj<AppointmentService>;
  let mockPatientService: jasmine.SpyObj<PatientService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    mockAppointmentService = jasmine.createSpyObj('AppointmentService', 
      ['getAppointmentById', 'getStatusText']);
    mockPatientService = jasmine.createSpyObj('PatientService', 
      ['getPatientById']);
    mockAuthService = jasmine.createSpyObj('AuthService', 
      ['validateToken', 'getAuthHeaders']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', 
      ['goBack']);

    mockAuthService.validateToken.and.returnValue(true);
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders());
    mockAppointmentService.getAppointmentById.and.returnValue(of({
      patientId: '123',
      providerId: '456',
      appointmentDate: new Date(),
      reason: 'Checkup',
      status: AppointmentStatus.Scheduled
    }));
    mockPatientService.getPatientById.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        provideHttpClient(withFetch()),
        { provide: AppointmentService, useValue: mockAppointmentService },
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NavigationService, useValue: mockNavigationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});