import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalRecordsListComponent } from './medical-records-list.component';
import { MedicalRecordsService } from '../../../../services/medical-records/medical-records.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ViewProfileButtonComponent } from '../../../buttons/view-profile-button/view-profile-button.component';
import { LogoutButtonComponent } from '../../../buttons/logout-button/logout-button.component';

describe('MedicalRecordsListComponent', () => {
  let component: MedicalRecordsListComponent;
  let fixture: ComponentFixture<MedicalRecordsListComponent>;
  let mockMedicalRecordsService: jasmine.SpyObj<MedicalRecordsService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockMedicalRecordsService = jasmine.createSpyObj('MedicalRecordsService', ['getUserMedicalRecords', 'deleteMedicalRecord']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockAuthService.getCurrentUser.and.returnValue({ id: '123' });
    mockMedicalRecordsService.getUserMedicalRecords.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [CommonModule, ViewProfileButtonComponent, LogoutButtonComponent],
      declarations: [MedicalRecordsListComponent],
      providers: [
        { provide: MedicalRecordsService, useValue: mockMedicalRecordsService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalRecordsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch medical records on init', () => {
    expect(mockMedicalRecordsService.getUserMedicalRecords).toHaveBeenCalledWith('123', 1, 10);
    expect(component.medicalRecords).toEqual([]);
  });

  it('should handle error when fetching medical records', () => {
    mockMedicalRecordsService.getUserMedicalRecords.and.returnValue(throwError(() => new Error('Error')));
    component.getMedicalRecords();
    expect(component.error).toBe('Failed to fetch records');
    expect(component.loading).toBeFalse();
  });

  it('should delete a medical record', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockMedicalRecordsService.deleteMedicalRecord.and.returnValue(of(void 0));
    component.medicalRecords = [{ recordId: '1', patientId: '1', date: '2023-01-01', diagnosis: 'Test Diagnosis', prescriptions: [], notes: 'Test Notes' }];
    component.deleteRecord('1');
    expect(mockMedicalRecordsService.deleteMedicalRecord).toHaveBeenCalledWith('1');
    expect(component.medicalRecords.length).toBe(0);
  });

  it('should handle error when deleting a medical record', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockMedicalRecordsService.deleteMedicalRecord.and.returnValue(throwError(() => new Error('Error')));
    component.deleteRecord('1');
    expect(component.medicalRecords.length).toBe(0);
  });
});
