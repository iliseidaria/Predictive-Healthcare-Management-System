import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientCreateComponent } from './patient-create.component';
import { PatientService } from '../../../../services/patient/patient.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpHeaders } from '@angular/common/http';

describe('PatientCreateComponent', () => {
  let component: PatientCreateComponent;
  let fixture: ComponentFixture<PatientCreateComponent>;
  let mockPatientService: jasmine.SpyObj<PatientService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    // Mock services
    mockPatientService = jasmine.createSpyObj('PatientService', ['createPatient']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['validateToken', 'getCurrentUser', 'getAuthHeaders']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);

    // Mock AuthService methods
    mockAuthService.validateToken.and.returnValue(true);
    mockAuthService.getCurrentUser.and.returnValue({ role: 'admin' });
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders({ Authorization: 'Bearer token' }));

    // Configure testing module
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, PatientCreateComponent],
      providers: [
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: NavigationService, useValue: mockNavigationService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the patient form', () => {
    expect(component.patientForm).toBeTruthy();
    expect(component.patientForm.get('firstName')).toBeTruthy();
    expect(component.patientForm.get('lastName')).toBeTruthy();
    expect(component.patientForm.get('dateOfBirth')).toBeTruthy();
  });

  it('should not create a patient if the form is invalid', () => {
    component.patientForm.patchValue({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      contactInformation: '',
      address: ''
    });

    component.onSubmit();

    expect(mockPatientService.createPatient).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should create a patient successfully', () => {
    component.patientForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1980-01-01',
      gender: '0',
      contactInformation: '555-1234',
      address: '123 Main St'
    });

    mockPatientService.createPatient.and.returnValue(of({ id: '123' }));

    component.onSubmit();

    expect(mockPatientService.createPatient).toHaveBeenCalledWith(
      {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1980-01-01',
        gender: 0,
        contactInformation: '555-1234',
        address: '123 Main St',
        photoPath: ''
      },
      jasmine.objectContaining({ headers: jasmine.any(HttpHeaders) })
    );
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/patient-detail/123');
  });

  it('should handle errors when creating a patient', () => {
    spyOn(window, 'alert');
    component.patientForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1980-01-01',
      gender: '0',
      contactInformation: '555-1234',
      address: '123 Main St'
    });

    mockPatientService.createPatient.and.returnValue(throwError(() => new Error('API error')));

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Error creating patient');
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should redirect to login if token is invalid', () => {
    mockAuthService.validateToken.and.returnValue(false);

    component.onSubmit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    expect(mockPatientService.createPatient).not.toHaveBeenCalled();
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockNavigationService.goBack).toHaveBeenCalled();
  });
});
