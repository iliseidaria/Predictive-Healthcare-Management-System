import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { RegisterComponent } from './register.component';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register', 'validateDoctorId']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.registerForm).toBeTruthy();
    expect(component.registerForm.get('email')).toBeTruthy();
    expect(component.registerForm.get('username')).toBeTruthy();
    expect(component.registerForm.get('password')).toBeTruthy();
    expect(component.registerForm.get('confirmPassword')).toBeTruthy();
    expect(component.registerForm.get('role')).toBeTruthy();
    expect(component.registerForm.get('doctorId')).toBeTruthy();
  });

  it('should validate password match', () => {
    component.registerForm.setValue({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'patient',
      doctorId: '',
    });

    expect(component.registerForm.valid).toBeTrue();
    expect(component.registerForm.errors).toBeNull();

    component.registerForm.get('confirmPassword')?.setValue('differentPassword');
    expect(component.registerForm.errors?.['passwordMismatch']).toBeUndefined();
  });

  it('should proceed with registration if doctor ID is valid', () => {
    component.registerForm.setValue({
      email: 'doctor@example.com',
      username: 'doctorUser',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'doctor',
      doctorId: 'validDoctorId',
    });

    authServiceSpy.validateDoctorId.and.returnValue(of(true));
    authServiceSpy.register.and.returnValue(of({}));

    component.onSubmit();

    expect(authServiceSpy.validateDoctorId).toHaveBeenCalledWith('validDoctorId');
    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should not proceed with registration if doctor ID is invalid', () => {
    component.registerForm.setValue({
      email: 'doctor@example.com',
      username: 'doctorUser',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'doctor',
      doctorId: 'invalidDoctorId',
    });

    authServiceSpy.validateDoctorId.and.returnValue(of(false));

    component.onSubmit();

    expect(authServiceSpy.validateDoctorId).toHaveBeenCalledWith('invalidDoctorId');
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should handle registration for patient role', () => {
    component.registerForm.setValue({
      email: 'patient@example.com',
      username: 'patientUser',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'patient',
      doctorId: '',
    });

    authServiceSpy.register.and.returnValue(of({}));

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledWith({
      email: 'patient@example.com',
      username: 'patientUser',
      password: 'password123',
      confirmPassword: 'password123',
    });
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should handle registration errors (username already exists)', () => {
    component.registerForm.setValue({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'patient',
      doctorId: '',
    });

    authServiceSpy.register.and.returnValue(
      throwError(() => ({ error: { error: 'Username already exists' } }))
    );

    spyOn(window, 'alert');
    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      'The username is already taken. Please choose another.'
    );
  });

  it('should handle registration errors (email already registered)', () => {
    component.registerForm.setValue({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'patient',
      doctorId: '',
    });

    authServiceSpy.register.and.returnValue(
      throwError(() => ({ error: { error: 'Email already registered' } }))
    );

    spyOn(window, 'alert');
    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      'The email is already registered. Please use another email or login.'
    );
  });

  it('should handle unexpected registration errors', () => {
    component.registerForm.setValue({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'patient',
      doctorId: '',
    });

    authServiceSpy.register.and.returnValue(throwError(() => new Error('Unexpected error')));

    spyOn(window, 'alert');
    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      'An unexpected error occurred. Please try again later.'
    );
  });
});
