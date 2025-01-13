import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientUpdateComponent } from './patient-update.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../../../services/patient/patient.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('PatientUpdateComponent', () => {
  let component: PatientUpdateComponent;
  let fixture: ComponentFixture<PatientUpdateComponent>;
  let mockPatientService: jasmine.SpyObj<PatientService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    mockPatientService = jasmine.createSpyObj('PatientService', ['getPatientById', 'updatePatient']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['validateToken', 'getCurrentUser', 'getAuthHeaders']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);

    mockAuthService.validateToken.and.returnValue(true);
    mockAuthService.getCurrentUser.and.returnValue({ role: 'Admin' });
    mockPatientService.getPatientById.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        provideHttpClient(withFetch()),
        provideRouter([]),
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NavigationService, useValue: mockNavigationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
