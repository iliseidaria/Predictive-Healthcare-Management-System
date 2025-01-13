import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { RegisterComponent } from './register.component';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create spies for AuthService and Router
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register', 'validateDoctorId']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        provideRouter([]),
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
  });

  it('should validate password match', () => {
    component.registerForm.setValue({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'patient',
      doctorId: '',
    } as any);

    expect(component.registerForm.valid).toBeTrue();
    expect(component.registerForm.errors).toBeNull();

    component.registerForm.get('confirmPassword')?.setValue('differentPassword');
    expect(component.registerForm.errors?.['passwordMismatch']).toBeUndefined();
  });

  it('should validate doctor ID if role is doctor', () => {
    component.registerForm.setValue({
      email: 'doctor@example.com',
      username: 'doctorUser',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'doctor',
      doctorId: 'validDoctorId',
    } as any);

    authServiceSpy.validateDoctorId.and.returnValue(of(true));

    component.onSubmit();

    expect(authServiceSpy.validateDoctorId).toHaveBeenCalledWith('validDoctorId');
    expect(authServiceSpy.register).toHaveBeenCalled();
  });

  it('should not proceed with registration if doctor ID is invalid', () => {
    component.registerForm.setValue({
      email: 'doctor@example.com',
      username: 'doctorUser',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'doctor',
      doctorId: 'invalidDoctorId',
    } as any);

    authServiceSpy.validateDoctorId.and.returnValue(of(false));

    component.onSubmit();

    expect(authServiceSpy.validateDoctorId).toHaveBeenCalledWith('invalidDoctorId');
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should call AuthService register directly if role is patient', () => {
    component.registerForm.setValue({
      email: 'patient@example.com',
      username: 'patientUser',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'patient',
      doctorId: '',
    } as any);

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

  it('should handle registration errors correctly', () => {
    component.registerForm.setValue({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'patient',
      doctorId: '',
    } as any);

    authServiceSpy.register.and.returnValue(throwError(() => ({ error: { error: 'Email already registered' } })));

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('The email is already registered. Please use another email or login.');
  });
});
