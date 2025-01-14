import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoutButtonComponent } from './logout-button.component';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('LogoutButtonComponent', () => {
  let component: LogoutButtonComponent;
  let fixture: ComponentFixture<LogoutButtonComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Mock AuthService
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);
    // Mock Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LogoutButtonComponent], // Import the standalone component
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.logout and navigate to login on logout', () => {
    // Call the logout method
    component.logout();

    // Verify that AuthService.logout() was called
    expect(mockAuthService.logout).toHaveBeenCalled();
    // Verify that Router.navigate() was called with ['/login']
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
