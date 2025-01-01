import { TestBed } from '@angular/core/testing';
import { PatientService } from './patient.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

describe('PatientService', () => {
  let service: PatientService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/v1/Patients`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PatientService]
    });
    service = TestBed.inject(PatientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('GET Operations', () => {
    it('should get all patients with pagination', () => {
      const page = 1;
      const size = 10;
      const mockResponse = { items: [], totalCount: 0 };

      service.getAllPatients(page, size).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}?page=1&size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should get patient by id', () => {
      const patientId = '123';
      const mockPatient = { id: patientId, firstName: 'John' };

      service.getPatientById(patientId).subscribe(patient => {
        expect(patient).toEqual(mockPatient);
      });

      const req = httpMock.expectOne(`${baseUrl}/${patientId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPatient);
    });
  });

  describe('POST Operations', () => {
    it('should create new patient', () => {
      const newPatient = { firstName: 'John', lastName: 'Doe' };

      service.createPatient(newPatient).subscribe(response => {
        expect(response).toEqual(newPatient);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newPatient);
      req.flush(newPatient);
    });
  });

  describe('PUT Operations', () => {
    it('should update existing patient', () => {
      const patientId = '123';
      const updatedPatient = { id: patientId, firstName: 'John Updated' };

      service.updatePatient(patientId, updatedPatient).subscribe(response => {
        expect(response).toEqual(updatedPatient);
      });

      const req = httpMock.expectOne(`${baseUrl}/${patientId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedPatient);
      req.flush(updatedPatient);
    });
  });

  describe('DELETE Operations', () => {
    it('should delete patient', () => {
      const patientId = '123';

      service.deletePatient(patientId).subscribe(response => {
        expect(response).toEqual({});
      });

      const req = httpMock.expectOne(`${baseUrl}/${patientId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP errors', () => {
      service.getAllPatients(1, 10).subscribe({
        error: error => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}?page=1&size=10`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('Header Management', () => {
    it('should include custom headers when provided', () => {
      const headers = new HttpHeaders().set('Authorization', 'Bearer token');
      
      service.getAllPatients(1, 10, { headers }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}?page=1&size=10`);
      expect(req.request.headers.get('Authorization')).toBe('Bearer token');
      req.flush({});
    });
  });
});