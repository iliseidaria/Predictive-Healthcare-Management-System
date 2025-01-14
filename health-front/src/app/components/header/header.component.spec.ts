import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth/auth.service';
import { LogoutButtonComponent } from '../buttons/logout-button/logout-button.component';
import { ViewProfileButtonComponent } from '../buttons/view-profile-button/view-profile-button.component';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // Mock AuthService
    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    mockAuthService.isLoggedIn.and.returnValue(true); // Simulate logged-in state

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, LogoutButtonComponent, ViewProfileButtonComponent], // Import the standalone components
      providers: [{ provide: AuthService, useValue: mockAuthService }], // Provide the mocked AuthService
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set isLoggedIn to true if the user is logged in', () => {
    // Call ngOnInit
    component.ngOnInit();

    // Verify that isLoggedIn is true
    expect(component.isLoggedIn).toBeTrue();
    expect(mockAuthService.isLoggedIn).toHaveBeenCalled();
  });

  it('should render the ViewProfileButtonComponent and LogoutButtonComponent when logged in', () => {
    // Simulate a logged-in state
    component.isLoggedIn = true;
    fixture.detectChanges();

    // Verify that the ViewProfileButtonComponent is rendered
    const viewProfileButton = fixture.nativeElement.querySelector('app-view-profile-button');
    expect(viewProfileButton).toBeTruthy();

    // Verify that the LogoutButtonComponent is rendered
    const logoutButton = fixture.nativeElement.querySelector('app-logout-button');
    expect(logoutButton).toBeTruthy();
  });

  it('should not render buttons if the user is not logged in', () => {
    // Simulate a logged-out state
    component.isLoggedIn = false;
    fixture.detectChanges();

    // Verify that the ViewProfileButtonComponent is not rendered
    const viewProfileButton = fixture.nativeElement.querySelector('app-view-profile-button');
    expect(viewProfileButton).toBeNull();

    // Verify that the LogoutButtonComponent is not rendered
    const logoutButton = fixture.nativeElement.querySelector('app-logout-button');
    expect(logoutButton).toBeNull();
  });
});
