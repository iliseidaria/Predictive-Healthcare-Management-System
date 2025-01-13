import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalRecordDeleteComponent } from './medical-records-delete.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalRecordsService } from '../../../../services/medical-records/medical-records.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MedicalRecordDeleteComponent', () => {
  let component: MedicalRecordDeleteComponent;
  let fixture: ComponentFixture<MedicalRecordDeleteComponent>;
  let mockActivatedRoute: any;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMedicalRecordsService: jasmine.SpyObj<MedicalRecordsService>;

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMedicalRecordsService = jasmine.createSpyObj('MedicalRecordsService', ['getMedicalRecordById', 'deleteMedicalRecord']);

    mockMedicalRecordsService.getMedicalRecordById.and.returnValue(of({
      recordId: '1',
      patientId: '1',
      date: '2023-01-01',
      diagnosis: 'Test Diagnosis',
      prescriptions: [],
      notes: 'Test Notes'
    }));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [MedicalRecordDeleteComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: MedicalRecordsService, useValue: mockMedicalRecordsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalRecordDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the medical record on init', () => {
    expect(mockMedicalRecordsService.getMedicalRecordById).toHaveBeenCalledWith('1');
    expect(component.record?.recordId).toBe('1');
  });

  it('should navigate to /medical-records on confirm delete', () => {
    mockMedicalRecordsService.deleteMedicalRecord.and.returnValue(of(void 0));
    component.confirmDelete();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/medical-records']);
  });

  it('should navigate to /medical-records on cancel', () => {
    component.cancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/medical-records']);
  });
});
