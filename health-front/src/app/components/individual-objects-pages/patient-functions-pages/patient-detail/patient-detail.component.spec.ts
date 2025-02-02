import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientDetailComponent } from './patient-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PatientService } from '../../../services/patient/patient.service';
import { AuthService } from '../../../services/auth/auth.service';
import { NavigationService } from '../../../services/navigation/navigation.service';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';

describe('PatientDetailComponent', () => {
  let component: PatientDetailComponent;
  let fixture: ComponentFixture<PatientDetailComponent>;
  let mockPatientService: jasmine.SpyObj<PatientService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    mockPatientService = jasmine.createSpyObj('PatientService', ['getPatientById']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['validateToken']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        provideHttpClient(withFetch()),
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NavigationService, useValue: mockNavigationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
