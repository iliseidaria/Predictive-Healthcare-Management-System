import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserUpdateComponent } from './user-update.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { NavigationService } from '../../services/navigation/navigation.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { of } from 'rxjs';

describe('UserUpdateComponent', () => {
  let component: UserUpdateComponent;
  let fixture: ComponentFixture<UserUpdateComponent>;
  
  const mockUserService = jasmine.createSpyObj('UserService', ['getUserById', 'updateUser']);
  const mockAuthService = jasmine.createSpyObj('AuthService', ['getAuthHeaders']);
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
  const mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);
  const mockActivatedRoute = { 
    snapshot: { 
      paramMap: { 
        get: () => '123' 
      } 
    } 
  };

  beforeEach(async () => {
    mockUserService.getUserById.and.returnValue(of({}));
    mockAuthService.getAuthHeaders.and.returnValue({});

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        provideHttpClient(withFetch()),
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});