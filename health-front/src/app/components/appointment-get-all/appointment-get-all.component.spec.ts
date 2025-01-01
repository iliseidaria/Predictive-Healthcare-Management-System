import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentGetAllComponent } from './appointment-get-all.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppointmentService } from '../../services/appointment/appointment.service';
import { PatientService } from '../../services/patient/patient.service';
import { AuthService } from '../../services/auth/auth.service';
import { NavigationService } from '../../services/navigation/navigation.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('AppointmentGetAllComponent', () => {
  let component: AppointmentGetAllComponent;
  let fixture: ComponentFixture<AppointmentGetAllComponent>;
  let mockAppointmentService: jasmine.SpyObj<AppointmentService>;
  let mockPatientService: jasmine.SpyObj<PatientService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    mockAppointmentService = jasmine.createSpyObj('AppointmentService', 
      ['getAppointments', 'getStatusText', 'updateAppointmentStatus', 'deleteAppointment']);
    mockPatientService = jasmine.createSpyObj('PatientService', ['getPatientById']);
    mockAuthService = jasmine.createSpyObj('AuthService', 
      ['validateToken', 'getCurrentUser', 'getAuthHeaders']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);

    mockAuthService.validateToken.and.returnValue(true);
    mockAuthService.getCurrentUser.and.returnValue({ role: 'Doctor' });
    mockAppointmentService.getAppointments.and.returnValue(of([]));
    mockPatientService.getPatientById.and.returnValue(of({}));

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
});