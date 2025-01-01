import { TestBed } from '@angular/core/testing';
import { AppointmentService } from './appointment.service';
import { AuthService } from '../auth/auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Appointment, AppointmentStatus } from '../../models/appointment';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let httpMock: HttpTestingController;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  const baseUrl = `${environment.apiUrl}/api/v1/Appointment`;

  const mockAppointment: Appointment = {
    patientId: '123',
    providerId: '456',
    appointmentDate: new Date(),
    reason: 'Test appointment',
    status: AppointmentStatus.Scheduled
  };

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getAuthHeaders']);
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders().set('Authorization', 'Bearer test-token'));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AppointmentService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(AppointmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get appointments with pagination', () => {
    service.getAppointments(1, 10).subscribe();

    const req = httpMock.expectOne(`${baseUrl}?pageNumber=0&pageSize=10`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should create appointment', () => {
    service.createAppointment(mockAppointment).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockAppointment);
    req.flush(mockAppointment);
  });

  it('should get appointment by id', () => {
    const id = '123';
    service.getAppointmentById(id).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAppointment);
  });

  it('should update appointment', () => {
    const id = '123';
    service.updateAppointment(id, mockAppointment).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockAppointment);
  });

  it('should update appointment status', () => {
    const id = '123';
    const status = AppointmentStatus.Completed;
    
    service.updateAppointmentStatus(id, status).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/${id}/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status });
    req.flush(mockAppointment);
  });

  it('should delete appointment', () => {
    const id = '123';
    service.deleteAppointment(id).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get user appointments', () => {
    const userId = '123';
    service.getUserAppointments(userId, 1, 10).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/user/${userId}?pageNumber=1&pageSize=10`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get correct status text', () => {
    expect(service.getStatusText(AppointmentStatus.Scheduled)).toBe('Scheduled');
    expect(service.getStatusText(AppointmentStatus.Completed)).toBe('Completed');
    expect(service.getStatusText(AppointmentStatus.Cancelled)).toBe('Cancelled');
  });
});