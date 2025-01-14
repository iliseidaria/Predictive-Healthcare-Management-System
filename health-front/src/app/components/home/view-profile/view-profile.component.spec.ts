import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewProfileComponent } from './view-profile.component';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpHeaders } from '@angular/common/http';

describe('ViewProfileComponent', () => {
  let component: ViewProfileComponent;
  let fixture: ComponentFixture<ViewProfileComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Mock services
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'getAuthHeaders']);
    mockUserService = jasmine.createSpyObj('UserService', ['getUserById', 'updateUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Mock method behaviors
    mockAuthService.getCurrentUser.and.returnValue({ id: '1', role: 'doctor', username: 'doctor1', email: 'doctor1@example.com' });
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders({ Authorization: 'Bearer token' }));
    mockUserService.getUserById.and.returnValue(of({
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      username: 'doctor1',
      email: 'doctor1@example.com',
      role: 'Doctor'
    }));
    mockUserService.updateUser.and.returnValue(of({
      id: '1',
      firstName: 'John Updated',
      lastName: 'Doe Updated',
      username: 'doctor1',
      email: 'doctor1updated@example.com',
      role: 'Doctor'
    }));

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule, ViewProfileComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load profile on init', () => {
    component.ngOnInit();
    expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    expect(mockUserService.getUserById).toHaveBeenCalledWith('1', { headers: new HttpHeaders({ Authorization: 'Bearer token' }) });
    expect(component.user.firstName).toBe('John');
  });

  it('should handle error during profile loading', () => {
    spyOn(console, 'error');
    mockUserService.getUserById.and.returnValue(throwError(() => new Error('Profile loading error')));

    component.loadProfile();

    expect(component.error).toBe('Failed to load profile.');
    expect(console.error).toHaveBeenCalledWith('Error loading user profile:', jasmine.any(Error));
  });

  it('should enable edit mode', () => {
    component.enableEdit();
    expect(component.isEditing).toBeTrue();
  });

  it('should cancel edit and reload profile', () => {
    spyOn(component, 'loadProfile'); // Spy on the loadProfile method
    component.cancelEdit();
    expect(component.isEditing).toBeFalse();
    expect(component.loadProfile).toHaveBeenCalled();
  });

  it('should save profile successfully', () => {
    component.user = {
      id: '1',
      firstName: 'John Updated',
      lastName: 'Doe Updated',
      username: 'doctor1',
      email: 'doctor1updated@example.com',
      role: 'Doctor'
    };

    component.saveProfile();

    expect(mockUserService.updateUser).toHaveBeenCalledWith('1', component.user, { headers: new HttpHeaders({ Authorization: 'Bearer token' }) });
    expect(component.isEditing).toBeFalse();
    expect(component.loading).toBeFalse();
    expect(component.user.firstName).toBe('John Updated');
  });

  it('should handle error during profile save', () => {
    spyOn(console, 'error');
    mockUserService.updateUser.and.returnValue(throwError(() => new Error('Profile save error')));

    component.user = {
      id: '1',
      firstName: 'John Updated',
      lastName: 'Doe Updated',
      username: 'doctor1',
      email: 'doctor1updated@example.com',
      role: 'Doctor'
    };

    component.saveProfile();

    expect(component.error).toBe('Failed to save profile.');
    expect(console.error).toHaveBeenCalledWith('Error saving profile:', jasmine.any(Error));
  });

  it('should navigate back to the doctor page if role is doctor', () => {
    component.user = { id: '1', role: 'doctor' };
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/doctor']);
  });

  it('should navigate back to the test page if role is not doctor', () => {
    component.user = { id: '1', role: 'patient' };
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/test-page']);
  });
});
