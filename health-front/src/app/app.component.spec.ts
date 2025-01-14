/*import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './services/auth/auth.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

describe('AppComponent', () => {
  let authService: jasmine.SpyObj<AuthService>;
  const mockPlatformId = 'browser';

  beforeEach(async () => {
    const mockAuthService = jasmine.createSpyObj('AuthService', ['restoreAuthState']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, HeaderComponent],
      declarations: [AppComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PLATFORM_ID, useValue: mockPlatformId },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should check if the platform is browser and restore auth state if token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue('test-token');
    Object.defineProperty(navigator, 'userAgent', { value: 'browser', configurable: true });

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.ngOnInit();

    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(authService.restoreAuthState).toHaveBeenCalledWith('test-token');
  });

  it('should not restore auth state if token does not exist', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    Object.defineProperty(navigator, 'userAgent', { value: 'browser', configurable: true });

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.ngOnInit();

    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(authService.restoreAuthState).not.toHaveBeenCalled();
  });

  it('should not interact with localStorage if platform is not browser', () => {
    spyOn(localStorage, 'getItem');
    Object.defineProperty(navigator, 'userAgent', { value: 'server', configurable: true });

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.ngOnInit();

    expect(localStorage.getItem).not.toHaveBeenCalled();
    expect(authService.restoreAuthState).not.toHaveBeenCalled();
  });
});*/
