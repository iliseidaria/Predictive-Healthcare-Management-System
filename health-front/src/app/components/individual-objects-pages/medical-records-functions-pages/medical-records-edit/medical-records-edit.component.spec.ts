import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalRecordEditComponent } from './medical-records-edit.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MedicalRecordsService, MedicalRecord } from '../../../../services/medical-records/medical-records.service';
import { CommonModule } from '@angular/common';
import { LogoutButtonComponent } from '../../../buttons/logout-button/logout-button.component';
import { ViewProfileButtonComponent } from '../../../buttons/view-profile-button/view-profile-button.component';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

describe('MedicalRecordEditComponent', () => {
  let component: MedicalRecordEditComponent;
  let fixture: ComponentFixture<MedicalRecordEditComponent>;
  let mockMedicalRecordsService: jasmine.SpyObj<MedicalRecordsService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    // Mock ActivatedRoute
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('123'), // Simulate recordId = 123
        },
      },
    };

    // Mock Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Mock MedicalRecordsService
    mockMedicalRecordsService = jasmine.createSpyObj('MedicalRecordsService', [
      'getMedicalRecordById',
      'updateMedicalRecord',
    ]);

    mockMedicalRecordsService.getMedicalRecordById.and.returnValue(
      of({
        recordId: '123',
        patientId: '456',
        date: '2023-01-01T12:00:00Z',
        diagnosis: 'Test Diagnosis',
        prescriptions: ['Medicine A', 'Medicine B'],
        notes: 'Test Notes',
      })
    );

    const updatedRecord: MedicalRecord = {
      recordId: '123',
      patientId: '456',
      date: '2023-01-01T12:00:00Z',
      diagnosis: 'Updated Diagnosis',
      prescriptions: ['Updated Prescription'],
      notes: 'Updated Notes',
    };

    mockMedicalRecordsService.updateMedicalRecord.and.returnValue(of(updatedRecord)); // Simulate successful update

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        HttpClientModule, // Add HttpClientModule here
        LogoutButtonComponent,
        ViewProfileButtonComponent,
      ],
      declarations: [MedicalRecordEditComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: MedicalRecordsService, useValue: mockMedicalRecordsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalRecordEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the medical record on init', () => {
    component.ngOnInit();
    expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
    expect(mockMedicalRecordsService.getMedicalRecordById).toHaveBeenCalledWith('123');
    expect(component.record).toEqual({
      date: '2023-01-01T12:00', // Converted to local datetime format
      diagnosis: 'Test Diagnosis',
      prescriptions: ['Medicine A', 'Medicine B'],
      notes: 'Test Notes',
    });
  });

  it('should handle errors when fetching medical record', () => {
    spyOn(console, 'error');
    mockMedicalRecordsService.getMedicalRecordById.and.returnValue(throwError(() => new Error('Error fetching record')));

    component.fetchRecord('123');

    expect(mockMedicalRecordsService.getMedicalRecordById).toHaveBeenCalledWith('123');
    expect(console.error).toHaveBeenCalledWith('Error fetching record:', jasmine.any(Error));
  });

  it('should save the medical record and navigate back to the list', () => {
    component.record = {
      date: '2023-01-01T12:00',
      diagnosis: 'Updated Diagnosis',
      prescriptions: ['Updated Prescription'],
      notes: 'Updated Notes',
    };

    component.saveRecord();

    expect(mockMedicalRecordsService.updateMedicalRecord).toHaveBeenCalledWith('123', {
      ...component.record,
      recordId: '123',
      patientId: '456', // Include patientId here
      date: '2023-01-01T12:00:00.000Z', // Converted to ISO format
      diagnosis: component.record.diagnosis || '', // Ensure diagnosis is not undefined
      prescriptions: component.record.prescriptions || [], // Ensure prescriptions is not undefined
      notes: component.record.notes || '', // Ensure notes is not undefined
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/medical-records']);
  });

  it('should handle errors when saving the medical record', () => {
    spyOn(console, 'error');
    mockMedicalRecordsService.updateMedicalRecord.and.returnValue(throwError(() => new Error('Error saving record')));

    component.record = {
      date: '2023-01-01T12:00',
      diagnosis: 'Updated Diagnosis',
      prescriptions: ['Updated Prescription'],
      notes: 'Updated Notes',
    };

    component.saveRecord();

    expect(mockMedicalRecordsService.updateMedicalRecord).toHaveBeenCalledWith('123', {
      ...component.record,
      recordId: '123',
      patientId: '456', // Include patientId here
      date: '2023-01-01T12:00:00.000Z', // Converted to ISO format
      diagnosis: component.record.diagnosis || '', // Ensure diagnosis is not undefined
      prescriptions: component.record.prescriptions || [], // Ensure prescriptions is not undefined
      notes: component.record.notes || '', // Ensure notes is not undefined
    });
    expect(console.error).toHaveBeenCalledWith('Error saving record:', jasmine.any(Error));
  });

  it('should navigate back to the list when cancelEdit is called', () => {
    component.cancelEdit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/medical-records']);
  });

  it('should navigate back to the list when backToList is called', () => {
    component.backToList();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/medical-records']);
  });
});
