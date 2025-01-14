import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrescriptionDetailComponent } from './prescription-detail.component';
import { PrescriptionService } from '../../../../services/prescription/prescription.service';
import { PatientService } from '../../../../services/patient/patient.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

describe('PrescriptionDetailComponent', () => {
  let component: PrescriptionDetailComponent;
  let fixture: ComponentFixture<PrescriptionDetailComponent>;
  let mockPrescriptionService: jasmine.SpyObj<PrescriptionService>;
  let mockPatientService: jasmine.SpyObj<PatientService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockActivatedRoute: any;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Mock services
    mockPrescriptionService = jasmine.createSpyObj('PrescriptionService', ['getPrescriptionById']);
    mockPatientService = jasmine.createSpyObj('PatientService', ['getPatientById']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getAuthHeaders']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('123') // Mock prescription ID
        }
      }
    };

    // Mock behaviors
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders({ Authorization: 'Bearer token' }));
    mockPrescriptionService.getPrescriptionById.and.returnValue(
      of({
        prescriptionId: '123',
        patientId: '456',
        medicationName: 'Medicine A',
        dosage: '10mg',
        frequency: 'Once a day',
        startDate: '2023-01-01',
        endDate: '2023-01-10',
        notes: 'Take after meals'
      })
    );
    mockPatientService.getPatientById.and.returnValue(
      of({
        id: '456',
        firstName: 'John',
        lastName: 'Doe'
      })
    );

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [PrescriptionDetailComponent],
      providers: [
        { provide: PrescriptionService, useValue: mockPrescriptionService },
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PrescriptionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load prescription on init', () => {
    component.ngOnInit();
    expect(mockPrescriptionService.getPrescriptionById).toHaveBeenCalledWith('123', { headers: jasmine.any(HttpHeaders) });
    expect(component.prescription).toEqual({
      prescriptionId: '123',
      patientId: '456',
      medicationName: 'Medicine A',
      dosage: '10mg',
      frequency: 'Once a day',
      startDate: '2023-01-01',
      endDate: '2023-01-10',
      notes: 'Take after meals'
    });
  });

  it('should load patient name after loading prescription', () => {
    component.loadPrescription('123');
    expect(mockPatientService.getPatientById).toHaveBeenCalledWith('456', { headers: jasmine.any(HttpHeaders) });
    expect(component.patientName).toBe('John Doe');
  });

  it('should handle errors when loading prescription', () => {
    spyOn(console, 'error');
    mockPrescriptionService.getPrescriptionById.and.returnValue(throwError(() => new Error('Error loading prescription')));

    component.loadPrescription('123');

    expect(component.error).toBe('Error loading prescription');
    expect(console.error).toHaveBeenCalledWith('Error:', jasmine.any(Error));
  });

  it('should handle errors when loading patient name', () => {
    spyOn(console, 'error');
    mockPatientService.getPatientById.and.returnValue(throwError(() => new Error('Error loading patient details')));

    component.loadPatientName('456');

    expect(component.error).toBe('Error loading patient details');
    expect(console.error).toHaveBeenCalledWith('Error:', jasmine.any(Error));
  });

  it('should set an error if no prescription ID is provided', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);
    component.ngOnInit();
    expect(component.error).toBe('No prescription ID provided');
    expect(component.loading).toBeFalse();
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockNavigationService.goBack).toHaveBeenCalled();
  });
});
