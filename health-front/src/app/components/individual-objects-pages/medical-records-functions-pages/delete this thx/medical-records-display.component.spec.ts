import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalRecordsComponent } from './medical-records-display.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { MedicalRecordsService } from '../../../../services/medical-records/medical-records.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

describe('MedicalRecordsComponent', () => {
  let component: MedicalRecordsComponent;
  let fixture: ComponentFixture<MedicalRecordsComponent>;
  let httpMock: HttpTestingController;
  let mockMedicalRecordsService: jasmine.SpyObj<MedicalRecordsService>;
  let router: Router;

  beforeEach(async () => {
    mockMedicalRecordsService = jasmine.createSpyObj('MedicalRecordsService', ['getMedicalRecordById']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MedicalRecordsComponent],
      providers: [
        provideHttpClient(withFetch()),
        provideRouter([]),
        { provide: MedicalRecordsService, useValue: mockMedicalRecordsService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MedicalRecordsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load medical records on init', () => {
    const mockRecords = [
      { recordId: '1', patientId: '123', date: '2023-01-01', diagnosis: 'Diagnosis 1', notes: 'Notes 1', prescriptions: [] },
      { recordId: '2', patientId: '123', date: '2023-01-02', diagnosis: 'Diagnosis 2', notes: 'Notes 2', prescriptions: [] }
    ];

    component.ngOnInit();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/MedicalRecord/user/some-user-id?page=1&size=5`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRecords);

    expect(component.medicalRecords.length).toBe(2);
    expect(component.hasNextPage).toBe(true);
  });

  it('should handle error when loading medical records fails', () => {
    component.ngOnInit();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/MedicalRecord/user/some-user-id?page=1&size=5`);
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Network error'), { status: 500 });

    expect(component.medicalRecords.length).toBe(0);
    expect(component.hasNextPage).toBe(false);
  });

  it('should view a medical record', () => {
    const mockRecord = { recordId: '1', patientId: '123', date: '2023-01-01', diagnosis: 'Diagnosis 1', notes: 'Notes 1', prescriptions: [] };
    mockMedicalRecordsService.getMedicalRecordById.and.returnValue(of(mockRecord));
    spyOn(router, 'navigate');

    component.viewRecord('1');

    expect(mockMedicalRecordsService.getMedicalRecordById).toHaveBeenCalledWith('1');
    expect(router.navigate).toHaveBeenCalledWith(['/medical-record', '1']);
  });

  it('should handle error when viewing a medical record fails', () => {
    mockMedicalRecordsService.getMedicalRecordById.and.returnValue(throwError(() => new Error('Failed to fetch record')));
    spyOn(console, 'error');

    component.viewRecord('1');

    expect(mockMedicalRecordsService.getMedicalRecordById).toHaveBeenCalledWith('1');
    expect(console.error).toHaveBeenCalledWith('Error fetching record:', jasmine.any(Error));
  });

  it('should navigate to edit a medical record', () => {
    spyOn(router, 'navigate');

    component.editRecord('1');

    expect(router.navigate).toHaveBeenCalledWith(['/medical-record/', '1']);
  });

  it('should navigate to the previous page', () => {
    component.page = 2;
    spyOn(component, 'loadMedicalRecords');

    component.prevPage();

    expect(component.page).toBe(1);
    expect(component.loadMedicalRecords).toHaveBeenCalled();
  });

  it('should not navigate to the previous page if already on the first page', () => {
    component.page = 1;
    spyOn(component, 'loadMedicalRecords');

    component.prevPage();

    expect(component.page).toBe(1);
    expect(component.loadMedicalRecords).not.toHaveBeenCalled();
  });

  it('should navigate to the next page', () => {
    component.hasNextPage = true;
    spyOn(component, 'loadMedicalRecords');

    component.nextPage();

    expect(component.page).toBe(2);
    expect(component.loadMedicalRecords).toHaveBeenCalled();
  });

  it('should not navigate to the next page if there is no next page', () => {
    component.hasNextPage = false;
    spyOn(component, 'loadMedicalRecords');

    component.nextPage();

    expect(component.page).toBe(1);
    expect(component.loadMedicalRecords).not.toHaveBeenCalled();
  });
});
