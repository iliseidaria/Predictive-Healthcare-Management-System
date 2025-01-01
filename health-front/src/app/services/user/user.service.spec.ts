import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User, UsersResponse, UserRole } from '../../models/user';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/v1/Admin/users`;

  const mockUser: User = {
    id: '123',
    username: 'testUser',
    email: 'test@example.com',
    role: UserRole.Doctor
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAllUsers', () => {
    it('should get users with pagination', () => {
      const mockResponse: UsersResponse = {
        users: [mockUser],
        totalUsers: 1
      };

      service.getAllUsers(1, 10).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          expect(response.users.length).toBe(1);
          expect(response.totalUsers).toBe(1);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}?page=1&size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty response', () => {
      const emptyResponse: UsersResponse = {
        users: [],
        totalUsers: 0
      };

      service.getAllUsers(1, 10).subscribe({
        next: (response) => {
          expect(response.users).toEqual([]);
          expect(response.totalUsers).toBe(0);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}?page=1&size=10`);
      req.flush(emptyResponse);
    });
  });

  describe('getUserById', () => {
    it('should get user by id', () => {
      service.getUserById(mockUser.id).subscribe({
        next: (user) => {
          expect(user).toEqual(mockUser);
          expect(user.id).toBe(mockUser.id);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/${mockUser.id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should handle non-existent user', () => {
      service.getUserById('nonexistent').subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/nonexistent`);
      req.flush('User not found', {
        status: 404,
        statusText: 'Not Found'
      });
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', () => {
      const updateData: Partial<User> = {
        username: 'updated',
        email: 'updated@example.com'
      };

      service.updateUser(mockUser.id, updateData).subscribe({
        next: (response) => {
          expect(response).toEqual({ ...mockUser, ...updateData });
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/${mockUser.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush({ ...mockUser, ...updateData });
    });

    it('should handle update failure', () => {
      const updateData: Partial<User> = { username: 'invalid' };

      service.updateUser(mockUser.id, updateData).subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/${mockUser.id}`);
      req.flush('Invalid data', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', () => {
      service.deleteUser(mockUser.id).subscribe({
        next: (response) => {
          expect(response).toBeNull();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/${mockUser.id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle deletion failure', () => {
      service.deleteUser('protected-user').subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(403);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/protected-user`);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });
  });

  describe('Header Management', () => {
    it('should include auth headers in all requests', () => {
      const headers = new HttpHeaders().set('Authorization', 'Bearer test-token');
      
      service.getAllUsers(1, 10, { headers }).subscribe();
      service.getUserById(mockUser.id, { headers }).subscribe();
      service.updateUser(mockUser.id, { username: 'test' }, { headers }).subscribe();
      service.deleteUser(mockUser.id, { headers }).subscribe();

      const requests = httpMock.match(req => {
        return req.headers.has('Authorization');
      });

      requests.forEach(req => {
        expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      });

      requests.forEach(req => req.flush({}));
    });
  });
});