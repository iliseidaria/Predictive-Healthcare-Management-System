import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientCreateComponent } from './patient-create.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient/patient.service';
import { AuthService } from '../../services/auth/auth.service';
import { NavigationService } from '../../services/navigation/navigation.service';
import { Router } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

describe('PatientCreateComponent', () => {
  let component: PatientCreateComponent;
  let fixture: ComponentFixture<PatientCreateComponent>;
  let mockPatientService: jasmine.SpyObj<PatientService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockPatientService = jasmine.createSpyObj('PatientService', ['createPatient']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['validateToken', 'getCurrentUser', 'getAuthHeaders']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
    
    mockPatientService.createPatient.and.returnValue(of({}));
    mockAuthService.validateToken.and.returnValue(true);
    mockAuthService.getCurrentUser.and.returnValue({ role: 'Doctor' });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule],
      providers: [
        FormBuilder,
        provideHttpClient(withFetch()),
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should validate required fields', () => {
    component.patientForm.controls['firstName'].setValue('');
    component.patientForm.controls['lastName'].setValue('');
    component.patientForm.controls['dateOfBirth'].setValue('');
    component.patientForm.controls['gender'].setValue('');
    component.patientForm.controls['contactInformation'].setValue('');
    component.patientForm.controls['address'].setValue('');

    expect(component.patientForm.controls['firstName'].errors?.['required']).toBeTruthy();
    expect(component.patientForm.controls['lastName'].errors?.['required']).toBeTruthy();
    expect(component.patientForm.controls['dateOfBirth'].errors?.['required']).toBeTruthy();
    expect(component.patientForm.controls['gender'].errors?.['required']).toBeTruthy();
    expect(component.patientForm.controls['contactInformation'].errors?.['required']).toBeTruthy();
    expect(component.patientForm.controls['address'].errors?.['required']).toBeTruthy();
  });
});