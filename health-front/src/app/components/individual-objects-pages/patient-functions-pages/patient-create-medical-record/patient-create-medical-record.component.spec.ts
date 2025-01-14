import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientCreateMedicalRecordComponent } from './patient-create-medical-record.component';
import { PatientService } from '../../../../services/patient/patient.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('PatientCreateMedicalRecordComponent', () => {
  let component: PatientCreateMedicalRecordComponent;
  let fixture: ComponentFixture<PatientCreateMedicalRecordComponent>;
  let mockPatientService: jasmine.SpyObj<PatientService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    // Mock services
    mockPatientService = jasmine.createSpyObj('PatientService', ['createMedicalRecord']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('123'), // Mock patient ID = '123'
        },
      },
    };

    // Configure testing module
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, PatientCreateMedicalRecordComponent],
      providers: [
        { provide: PatientService, useValue: mockPatientService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientCreateMedicalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with patient ID from route', () => {
    component.ngOnInit();
    expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
    expect(component.patientId).toBe('123');
  });

  it('should create a medical record successfully', () => {
    const mockMedicalRecordData = {
      diagnosis: 'Test Diagnosis',
      notes: 'Test Notes',
      date: '2023-01-01T10:00:00Z',
    };

    component.medicalRecordData = {
      diagnosis: 'Test Diagnosis',
      notes: 'Test Notes',
      date: '2023-01-01T10:00',
    };

    mockPatientService.createMedicalRecord.and.returnValue(of({}));

    component.createMedicalRecord();

    expect(mockPatientService.createMedicalRecord).toHaveBeenCalledWith('123', {
      ...mockMedicalRecordData,
      patientId: '123',
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/get-all-patients']);
    expect(component.errorMessage).toBe('');
  });

  it('should show an error for invalid date input', () => {
    component.medicalRecordData = {
      diagnosis: 'Test Diagnosis',
      notes: 'Test Notes',
      date: 'invalid-date',
    };

    component.createMedicalRecord();

    expect(component.errorMessage).toBe('Please enter a valid date and time.');
    expect(mockPatientService.createMedicalRecord).not.toHaveBeenCalled();
  });

  it('should handle error when creating a medical record fails', () => {
    component.medicalRecordData = {
      diagnosis: 'Test Diagnosis',
      notes: 'Test Notes',
      date: '2023-01-01T10:00',
    };

    mockPatientService.createMedicalRecord.and.returnValue(throwError(() => new Error('API error')));

    component.createMedicalRecord();

    expect(component.errorMessage).toBe('An error occurred while creating the medical record. Please try again.');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockNavigationService.goBack).toHaveBeenCalled();
  });
});
