import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: router }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('Authentication', () => {
    it('should login successfully', () => {
      const credentials = { username: 'test', password: 'test123' };
      const mockResponse = { token: 'fake-token' };

      service.login(credentials).subscribe();
      
      const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/Auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should register new user', () => {
      const user = {
        username: 'test',
        email: 'test@test.com',
        password: 'test123',
        confirmPassword: 'test123'
      };

      service.register(user).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/Auth/register`);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });

    it('should logout user', () => {
      localStorage.setItem('token', 'test-token');
      
      service.logout().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/Auth/logout`);
      expect(req.request.method).toBe('POST');
      req.flush({});
      
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('Token Management', () => {
    it('should get auth headers', () => {
      const token = 'test-token';
      localStorage.setItem('token', token);
      
      const headers = service.getAuthHeaders();
      expect(headers.get('Authorization')).toBe(`Bearer ${token}`);
    });

    it('should store token', () => {
      const token = 'test-token';
      service.storeToken(token);
      expect(localStorage.getItem('token')).toBe(token);
    });
  });

  describe('User Management', () => {
    it('should get current user from valid token', () => {
      const token = createMockJWT(3600);
      localStorage.setItem('token', token);
      
      const user = service.getCurrentUser();
      expect(user).toBeTruthy();
      expect(user.role).toBe('Admin');
    });

    it('should return null for invalid token', () => {
      localStorage.setItem('token', 'invalid-token');
      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('Health Checks', () => {
    it('should check server health', fakeAsync(() => {
      service.checkServerHealth().subscribe(isHealthy => {
        expect(isHealthy).toBeTrue();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/Auth`);
      expect(req.request.method).toBe('OPTIONS');
      req.flush({});
      
      tick(100);
    }));

    it('should handle server timeout', fakeAsync(() => {
      service.checkServerHealth().subscribe(isHealthy => {
        expect(isHealthy).toBeFalse();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/Auth`);
      req.error(new ErrorEvent('timeout'));
      
      tick(3100);
    }));
  });
});

function createMockJWT(expiresIn: number): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    exp: Math.floor(Date.now() / 1000) + expiresIn,
    sub: 'test-user',
    role: 'Admin',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role': 'Admin'
  }));
  const signature = 'mock-signature';
  return `${header}.${payload}.${signature}`;
}