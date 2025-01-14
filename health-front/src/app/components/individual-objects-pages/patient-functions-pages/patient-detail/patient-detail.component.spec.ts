import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientDetailComponent } from './patient-detail.component';
import { PatientService } from '../../../../services/patient/patient.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpHeaders } from '@angular/common/http';

describe('PatientDetailComponent', () => {
  let component: PatientDetailComponent;
  let fixture: ComponentFixture<PatientDetailComponent>;
  let mockPatientService: jasmine.SpyObj<PatientService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    // Mock Services
    mockPatientService = jasmine.createSpyObj('PatientService', ['getPatientById']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['validateToken', 'getAuthHeaders', 'getCurrentUser']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Mock Behaviors
    mockAuthService.validateToken.and.returnValue(true);
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders({ Authorization: 'Bearer token' }));

    mockPatientService.getPatientById.and.returnValue(
      of({
        patientId: '123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1980-01-01',
        gender: 'Male',
        contactInformation: '555-1234',
        address: '123 Main St',
        photoPath: '',
        medicalHistory: [
          {
            recordId: '1',
            patientId: '123',
            date: '2023-01-01',
            diagnosis: 'Diabetes',
            notes: 'Some notes',
            prescriptions: []
          }
        ],
        appointments: []
      })
    );

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [PatientDetailComponent],
      providers: [
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: (key: string) => (key === 'id' ? '123' : null) }) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientDetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load patient details on init', () => {
    component.ngOnInit();
    expect(mockPatientService.getPatientById).toHaveBeenCalledWith('123', { headers: jasmine.any(HttpHeaders) });
    expect(component.patient.firstName).toBe('John');
    expect(component.patient.lastName).toBe('Doe');
  });

  it('should handle errors when loading patient details', () => {
    spyOn(console, 'error');
    mockPatientService.getPatientById.and.returnValue(throwError(() => new Error('Error loading patient')));

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error loading patient:', jasmine.any(Error));
    expect(component.patient).toBeUndefined();
  });

  it('should fetch predictions for a patient', () => {
    component.patient = {
      patientId: '123',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1980-01-01',
      gender: 'Male',
      contactInformation: '555-1234',
      address: '123 Main St',
      photoPath: '',
      medicalHistory: []
    };

    component.fetchPredictions();

    const req = httpMock.expectOne('http://localhost:8000/predict');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.patient_id).toBe('123');
    req.flush({ predictions: { Diabetes: 0.85, Hypertension: 0.12 } });

    expect(component.predictions).toEqual({ Diabetes: 0.85, Hypertension: 0.12 });
  });

  it('should handle errors when fetching predictions', () => {
    spyOn(console, 'error');
    component.patient = {
      patientId: '123',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1980-01-01',
      gender: 'Male',
      contactInformation: '555-1234',
      address: '123 Main St',
      photoPath: '',
      medicalHistory: []
    };

    component.fetchPredictions();

    const req = httpMock.expectOne('http://localhost:8000/predict');
    req.error(new ErrorEvent('Network error'));

    expect(console.error).toHaveBeenCalledWith('Error fetching predictions:', jasmine.anything());
  });

  it('should calculate age from date of birth', () => {
    const age = component.calculateAge('1980-01-01');
    const currentYear = new Date().getFullYear();
    expect(age).toBe(currentYear - 1980);
  });

  it('should format predictions correctly', () => {
    const formatted = component.formatPredictions({ Diabetes: 0.85, Hypertension: 0.03 });
    expect(formatted).toBe('Diabetes (85.00%)');
  });

  it('should open and close the modal', () => {
    component.showFullImage();
    expect(component.isModalOpen).toBeTrue();

    component.closeModal();
    expect(component.isModalOpen).toBeFalse();
  });

  it('should go back when goBack is called', () => {
    component.goBack();
    expect(mockNavigationService.goBack).toHaveBeenCalled();
  });
});
