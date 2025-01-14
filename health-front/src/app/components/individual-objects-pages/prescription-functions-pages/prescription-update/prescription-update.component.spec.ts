import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrescriptionUpdateComponent } from './prescription-update.component';
import { PrescriptionService } from '../../../../services/prescription/prescription.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

describe('PrescriptionUpdateComponent', () => {
  let component: PrescriptionUpdateComponent;
  let fixture: ComponentFixture<PrescriptionUpdateComponent>;
  let mockPrescriptionService: jasmine.SpyObj<PrescriptionService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    // Mock services
    mockPrescriptionService = jasmine.createSpyObj('PrescriptionService', ['getPrescriptionById', 'updatePrescription']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getAuthHeaders']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('123') // Mock prescription ID
        }
      }
    };

    // Mock method behaviors
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders({ Authorization: 'Bearer token' }));
    mockPrescriptionService.getPrescriptionById.and.returnValue(
      of({
        prescriptionId: '123',
        patientId: '456',
        medicationName: 'Medicine A',
        dosage: '10mg',
        frequency: 'Once a day',
        startDate: '2023-01-01T00:00:00.000Z',
        endDate: '2023-01-10T00:00:00.000Z',
        notes: 'Take after meals'
      })
    );

    mockPrescriptionService.updatePrescription.and.returnValue(
      of({
        prescriptionId: '123',
        patientId: '456',
        medicationName: 'Medicine A Updated',
        dosage: '20mg',
        frequency: 'Twice a day',
        startDate: '2023-01-02T00:00:00.000Z',
        endDate: '2023-01-12T00:00:00.000Z',
        notes: 'Updated notes'
      })
    );

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [PrescriptionUpdateComponent],
      providers: [
        { provide: PrescriptionService, useValue: mockPrescriptionService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PrescriptionUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load prescription on init', () => {
    component.ngOnInit();
    expect(mockPrescriptionService.getPrescriptionById).toHaveBeenCalledWith('123', { headers: jasmine.any(HttpHeaders) });
    expect(component.prescriptionForm.value).toEqual({
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

  it('should handle errors when loading prescription', () => {
    spyOn(console, 'error');
    mockPrescriptionService.getPrescriptionById.and.returnValue(throwError(() => new Error('Error loading prescription')));

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error loading prescription:', jasmine.any(Error));
  });

  it('should submit the updated prescription successfully', () => {
    component.prescriptionForm.setValue({
      prescriptionId: '123',
      patientId: '456',
      medicationName: 'Medicine A Updated',
      dosage: '20mg',
      frequency: 'Twice a day',
      startDate: '2023-01-02',
      endDate: '2023-01-12',
      notes: 'Updated notes'
    });

    component.onSubmit();

    expect(mockPrescriptionService.updatePrescription).toHaveBeenCalledWith(
      '123',
      {
        prescriptionId: '123',
        patientId: '456',
        medicationName: 'Medicine A Updated',
        dosage: '20mg',
        frequency: 'Twice a day',
        startDate: '2023-01-02T00:00:00.000Z',
        endDate: '2023-01-12T00:00:00.000Z',
        notes: 'Updated notes'
      },
      { headers: jasmine.any(HttpHeaders) }
    );
    expect(mockNavigationService.goBack).toHaveBeenCalled();
  });

  it('should handle errors during prescription update', () => {
    spyOn(console, 'error');
    mockPrescriptionService.updatePrescription.and.returnValue(throwError(() => new Error('Error updating prescription')));

    component.prescriptionForm.setValue({
      prescriptionId: '123',
      patientId: '456',
      medicationName: 'Medicine A Updated',
      dosage: '20mg',
      frequency: 'Twice a day',
      startDate: '2023-01-02',
      endDate: '2023-01-12',
      notes: 'Updated notes'
    });

    component.onSubmit();

    expect(component.prescriptionForm.valid).toBeTrue();
    expect(console.error).toHaveBeenCalledWith('Error updating prescription:', jasmine.any(Error));
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockNavigationService.goBack).toHaveBeenCalled();
  });
});
