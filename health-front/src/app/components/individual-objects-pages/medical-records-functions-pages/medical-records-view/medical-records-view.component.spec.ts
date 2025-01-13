import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalRecordViewComponent } from './medical-records-view.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MedicalRecordsService } from '../../../../services/medical-records/medical-records.service';
import { CommonModule } from '@angular/common';
import { ViewProfileButtonComponent } from '../../../buttons/view-profile-button/view-profile-button.component';
import { LogoutButtonComponent } from '../../../buttons/logout-button/logout-button.component';

describe('MedicalRecordViewComponent', () => {
  let component: MedicalRecordViewComponent;
  let fixture: ComponentFixture<MedicalRecordViewComponent>;
  let mockActivatedRoute: any;
  let mockRouter: any;
  let mockMedicalRecordsService: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('123')
        }
      }
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockMedicalRecordsService = {
      getMedicalRecordById: jasmine.createSpy('getMedicalRecordById').and.returnValue(of({
        recordId: '123',
        patientId: '456',
        date: '2023-01-01',
        diagnosis: 'Test Diagnosis',
        prescriptions: [],
        notes: 'Test Notes'
      }))
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, ViewProfileButtonComponent, LogoutButtonComponent],
      declarations: [MedicalRecordViewComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: MedicalRecordsService, useValue: mockMedicalRecordsService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MedicalRecordViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the medical record on init', () => {
    expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
    expect(mockMedicalRecordsService.getMedicalRecordById).toHaveBeenCalledWith('123');
    expect(component.record).toEqual({
      recordId: '123',
      patientId: '456',
      date: '2023-01-01',
      diagnosis: 'Test Diagnosis',
      prescriptions: [],
      notes: 'Test Notes'
    });
  });

  it('should handle error when fetching medical record', () => {
    mockMedicalRecordsService.getMedicalRecordById.and.returnValue(throwError(() => new Error('Error fetching record')));
    component.fetchRecord('123');
    expect(component.record).toEqual({
      recordId: '',
      patientId: '',
      date: '',
      diagnosis: '',
      prescriptions: [],
      notes: ''
    });
  });

  it('should navigate back to the list', () => {
    component.backToList();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/medical-records']);
  });
});
