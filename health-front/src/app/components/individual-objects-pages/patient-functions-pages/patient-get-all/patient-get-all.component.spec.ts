import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientGetAllComponent } from './patient-get-all.component';
import { PatientService } from '../../../../services/patient/patient.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('PatientGetAllComponent', () => {
  let component: PatientGetAllComponent;
  let fixture: ComponentFixture<PatientGetAllComponent>;
  let mockPatientService: jasmine.SpyObj<PatientService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    mockPatientService = jasmine.createSpyObj('PatientService', ['getAllPatients', 'deletePatient']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['validateToken', 'getCurrentUser', 'getAuthHeaders']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);

    // Setup mock returns
    mockAuthService.validateToken.and.returnValue(true);
    mockAuthService.getCurrentUser.and.returnValue({ role: 'Doctor' });
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders());
    mockPatientService.getAllPatients.and.returnValue(of({ items: [], totalCount: 0 }));

    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch()),
        provideRouter([]),
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NavigationService, useValue: mockNavigationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientGetAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

