import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NonAuthGuard } from './non-auth.guard';
import { AuthService } from '../auth/auth.service';

describe('NonAuthGuard', () => {
  let guard: NonAuthGuard;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['validateToken']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        NonAuthGuard,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    guard = TestBed.inject(NonAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if the user is not authenticated', () => {
    mockAuthService.validateToken.and.returnValue(false);

    const result = guard.canActivate();

    expect(result).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should block access and redirect if the user is authenticated', () => {
    mockAuthService.validateToken.and.returnValue(true);

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/test-page']);
  });
});
