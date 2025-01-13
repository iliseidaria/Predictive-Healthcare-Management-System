import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestPageComponent } from './test-page.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { of } from 'rxjs';

describe('TestPageComponent', () => {
  let component: TestPageComponent;
  let fixture: ComponentFixture<TestPageComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'validateToken',
      'getCurrentUser',
      'logout'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Setup default mock returns
    mockAuthService.validateToken.and.returnValue(true);
    mockAuthService.getCurrentUser.and.returnValue({ role: 'User' });
    mockAuthService.logout.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withFetch()),
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
