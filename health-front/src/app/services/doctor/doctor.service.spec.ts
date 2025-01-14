import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DoctorService } from './doctor.service';
import { environment } from '../../../environments/environment';

describe('DoctorService', () => {
  let service: DoctorService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl + '/api/v1/Auth/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DoctorService],
    });
    service = TestBed.inject(DoctorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all doctors', () => {
    const mockResponse = {
      items: [
        { id: '1', name: 'Doctor A' },
        { id: '2', name: 'Doctor B' },
      ],
      totalCount: 2,
    };

    service.getAllDoctors(1, 10).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}?pageNumber=1&pageSize=10&role=doctor`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should delete a doctor', () => {
    service.deleteDoctor('1').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should search for doctors by search term', () => {
    const mockResponse = {
      items: [
        { id: '1', name: 'Doctor A' },
      ],
      totalCount: 1,
    };

    service.searchDoctors('Doctor A', 1, 10).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/search?searchTerm=Doctor%20A&pageNumber=1&pageSize=10&role=doctor`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
