import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserGetAppointmentsComponent } from './user-get-appointments.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppointmentService } from '../../../../services/appointment/appointment.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { HttpHeaders, provideHttpClient, withFetch } from '@angular/common/http';
import { of } from 'rxjs';

describe('UserGetAppointmentsComponent', () => {
  let component: UserGetAppointmentsComponent;
  let fixture: ComponentFixture<UserGetAppointmentsComponent>;
  let mockAppointmentService: jasmine.SpyObj<AppointmentService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    mockAppointmentService = jasmine.createSpyObj('AppointmentService', ['getUserAppointments', 'getStatusText']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['validateToken', 'getCurrentUser', 'getAuthHeaders']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);

    // Setup mock returns
    mockAuthService.validateToken.and.returnValue(true);
    mockAuthService.getCurrentUser.and.returnValue({ id: '123' });
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders());
    mockAppointmentService.getUserAppointments.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        provideHttpClient(withFetch()),
        { provide: AppointmentService, useValue: mockAppointmentService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NavigationService, useValue: mockNavigationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserGetAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
