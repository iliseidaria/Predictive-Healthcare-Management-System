import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login.component';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'validateToken', 'getCurrentUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, LoginComponent],
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

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form', () => {
    expect(component.loginForm).toBeTruthy();
    expect(component.loginForm.get('username')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();
  });

  it('should redirect if token is valid during ngOnInit', () => {
    authServiceSpy.validateToken.and.returnValue(true);
    authServiceSpy.getCurrentUser.and.returnValue({ role: 'doctor' });

    component.ngOnInit();

    expect(authServiceSpy.validateToken).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/doctor']);
  });

  it('should not redirect if token is invalid during ngOnInit', () => {
    authServiceSpy.validateToken.and.returnValue(false);

    component.ngOnInit();

    expect(authServiceSpy.validateToken).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should call AuthService login on valid form submission', () => {
    component.loginForm.setValue({
      username: 'testuser',
      password: 'password123',
    });

    authServiceSpy.login.and.returnValue(of({ token: 'fake-token' }));
    authServiceSpy.getCurrentUser.and.returnValue({ role: 'doctor' });

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    });
    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/doctor']);
  });

  it('should display alert if login fails', () => {
    spyOn(window, 'alert');
    component.loginForm.setValue({
      username: 'testuser',
      password: 'wrongpassword',
    });

    authServiceSpy.login.and.returnValue(throwError(() => new Error('Login failed')));

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'wrongpassword',
    });
    expect(window.alert).toHaveBeenCalledWith('An error occurred during login');
  });

  it('should not call AuthService login if form is invalid', () => {
    component.loginForm.setValue({
      username: '',
      password: '',
    });

    component.onSubmit();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should display alert if token is missing in response', () => {
    spyOn(window, 'alert');
    component.loginForm.setValue({
      username: 'testuser',
      password: 'password123',
    });

    authServiceSpy.login.and.returnValue(of({}));

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
  });
});
