import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersGetAllComponent } from './users-get-all.component';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { NavigationService } from '../../services/navigation/navigation.service';
import { HttpHeaders, provideHttpClient, withFetch } from '@angular/common/http';
import { of } from 'rxjs';

describe('UsersGetAllComponent', () => {
  let component: UsersGetAllComponent;
  let fixture: ComponentFixture<UsersGetAllComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getAllUsers', 'deleteUser']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getAuthHeaders']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);

    mockUserService.getAllUsers.and.returnValue(of({ users: [], totalUsers: 0 }));
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders());

    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withFetch()),
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: NavigationService, useValue: mockNavigationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersGetAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});