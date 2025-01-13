import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login.component';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create spies for AuthService and Router
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'validateToken', 'getCurrentUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        provideRouter([]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.loginForm).toBeTruthy();
    expect(component.loginForm.get('email')).toBeTruthy();
    expect(component.loginForm.get('username')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();
  });

  it('should call AuthService login on form submit if form is valid', () => {
    // Set valid form values
    component.loginForm.setValue({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    });

    // Mock AuthService login response
    authServiceSpy.login.and.returnValue(of({ token: 'fake-token' }));

    // Trigger form submit
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    });
    expect(routerSpy.navigate).toHaveBeenCalled(); // Check for navigation
  });

  it('should not call AuthService login if form is invalid', () => {
    // Set invalid form values
    component.loginForm.setValue({
      email: '',
      username: '',
      password: '',
    });

    component.onSubmit();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });
});
