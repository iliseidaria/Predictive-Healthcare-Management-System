import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailComponent } from './user-detail.component';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Mock AuthService
    authServiceSpy = jasmine.createSpyObj('AuthService', ['validateToken', 'getCurrentUser']);

    // Mock Router
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [UserDetailComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user details if the token is valid', () => {
    authServiceSpy.validateToken.and.returnValue(true);
    authServiceSpy.getCurrentUser.and.returnValue({
      username: 'testuser',
      email: 'test@example.com',
      role: 'admin',
    });

    component.ngOnInit();

    expect(authServiceSpy.validateToken).toHaveBeenCalled();
    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(component.username).toBe('testuser');
    expect(component.email).toBe('test@example.com');
    expect(component.role).toBe('admin');
  });

  it('should navigate to login if the token is invalid', () => {
    authServiceSpy.validateToken.and.returnValue(false);

    component.ngOnInit();

    expect(authServiceSpy.validateToken).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Invalid or expired token. Please log in again.');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle null user gracefully', () => {
    authServiceSpy.validateToken.and.returnValue(true);
    authServiceSpy.getCurrentUser.and.returnValue(null); // Simulate no user returned

    component.ngOnInit();

    expect(authServiceSpy.validateToken).toHaveBeenCalled();
    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(component.username).toBe('');
    expect(component.email).toBe('');
    expect(component.role).toBe('');
  });
});
