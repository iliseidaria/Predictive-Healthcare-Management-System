import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrescriptionCreateComponent } from './prescription-create.component';
import { PrescriptionService } from '../../../../services/prescription/prescription.service';
import { PatientService } from '../../../../services/patient/patient.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

describe('PrescriptionCreateComponent', () => {
  let component: PrescriptionCreateComponent;
  let fixture: ComponentFixture<PrescriptionCreateComponent>;
  let mockPrescriptionService: jasmine.SpyObj<PrescriptionService>;
  let mockPatientService: jasmine.SpyObj<PatientService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    // Mock services
    mockPrescriptionService = jasmine.createSpyObj('PrescriptionService', ['createPrescription']);
    mockPatientService = jasmine.createSpyObj('PatientService', ['getAllPatients']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getAuthHeaders']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);

    // Mock method behaviors
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders({ Authorization: 'Bearer token' }));
    mockPrescriptionService.createPrescription.and.returnValue(
      of({
        prescriptionId: '1',
        patientId: '123',
        medicationName: 'Medicine A',
        dosage: '10mg',
        frequency: 'Once a day',
        startDate: '2023-01-01',
        endDate: '2023-01-10',
        notes: 'Take after meals'
      })
    );

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [PrescriptionCreateComponent],
      providers: [
        { provide: PrescriptionService, useValue: mockPrescriptionService },
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NavigationService, useValue: mockNavigationService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PrescriptionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.prescriptionForm).toBeTruthy();
    expect(component.prescriptionForm.controls['patientId']).toBeTruthy();
    expect(component.prescriptionForm.controls['medicationName']).toBeTruthy();
    expect(component.prescriptionForm.controls['dosage']).toBeTruthy();
    expect(component.prescriptionForm.controls['frequency']).toBeTruthy();
    expect(component.prescriptionForm.controls['startDate']).toBeTruthy();
    expect(component.prescriptionForm.controls['endDate']).toBeTruthy();
    expect(component.prescriptionForm.controls['notes']).toBeTruthy();
  });

  it('should log patient ID changes', () => {
    spyOn(console, 'log');
    const patientIdControl = component.prescriptionForm.get('patientId');
    patientIdControl?.setValue('123');
    expect(console.log).toHaveBeenCalledWith('Patient ID changed:', '123');
  });

  it('should submit the form successfully', () => {
    component.prescriptionForm.setValue({
      patientId: '123',
      medicationName: 'Medicine A',
      dosage: '10mg',
      frequency: 'Once a day',
      startDate: '2023-01-01',
      endDate: '2023-01-10',
      notes: 'Take after meals'
    });

    component.onSubmit();

    expect(mockPrescriptionService.createPrescription).toHaveBeenCalledWith(
      {
        patientId: '123',
        medicationName: 'Medicine A',
        dosage: '10mg',
        frequency: 'Once a day',
        startDate: jasmine.any(String), // Verify it's a valid string
        endDate: jasmine.any(String),  // Verify it's a valid string
        notes: 'Take after meals'
      },
      { headers: new HttpHeaders({ Authorization: 'Bearer token' }) }
    );
    expect(mockNavigationService.goBack).toHaveBeenCalled();
  });

  it('should handle errors during submission', () => {
    spyOn(console, 'error');
    mockPrescriptionService.createPrescription.and.returnValue(throwError(() => new Error('Error creating prescription')));

    component.prescriptionForm.setValue({
      patientId: '123',
      medicationName: 'Medicine A',
      dosage: '10mg',
      frequency: 'Once a day',
      startDate: '2023-01-01',
      endDate: '2023-01-10',
      notes: 'Take after meals'
    });

    component.onSubmit();

    expect(component.error).toBe('Error creating prescription');
    expect(component.loading).toBeFalse();
    expect(console.error).toHaveBeenCalled();
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockNavigationService.goBack).toHaveBeenCalled();
  });
});
