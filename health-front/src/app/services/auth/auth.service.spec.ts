import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifică dacă nu există cereri nerezolvate
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send login request and return token', () => {
    const mockResponse = { token: 'mock-jwt-token' };

    service.login({ username: 'testuser', password: 'testpassword' }).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/v1/auth');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'testuser',
      password: 'testpassword',
    });

    // Simulează un răspuns de succes din backend
    req.flush(mockResponse);
  });

  it('should handle login error', () => {
    const errorMessage = 'Invalid credentials';

    service.login({ username: 'wronguser', password: 'wrongpassword' }).subscribe(
      () => fail('Expected an error, not a token'),
      (error) => {
        expect(error.status).toBe(401); // Unauthorized
        expect(error.statusText).toBe('Unauthorized');
      }
    );

    const req = httpMock.expectOne('/api/v1/auth');
    expect(req.request.method).toBe('POST');

    // Simulează o eroare de autentificare
    req.flush(errorMessage, { status: 401, statusText: 'Unauthorized' });
  });
});
