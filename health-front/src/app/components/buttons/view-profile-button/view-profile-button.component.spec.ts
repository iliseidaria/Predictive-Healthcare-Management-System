import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewProfileButtonComponent } from './view-profile-button.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ViewProfileButtonComponent', () => {
  let component: ViewProfileButtonComponent;
  let fixture: ComponentFixture<ViewProfileButtonComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Mock Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ViewProfileButtonComponent], // Import the standalone component
      providers: [
        { provide: Router, useValue: mockRouter }, // Provide the mocked router
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewProfileButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /profile when viewProfile is called', () => {
    // Call the viewProfile method
    component.viewProfile();

    // Verify that Router.navigate() was called with ['/profile']
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
  });
});
