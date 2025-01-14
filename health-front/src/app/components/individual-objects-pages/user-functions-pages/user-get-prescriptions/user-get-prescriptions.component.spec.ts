import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserGetPrescriptionsComponent } from './user-get-prescriptions.component';
import { PrescriptionService } from '../../../../services/prescription/prescription.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationService } from '../../../../services/navigation/navigation.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

describe('UserGetPrescriptionsComponent', () => {
  let component: UserGetPrescriptionsComponent;
  let fixture: ComponentFixture<UserGetPrescriptionsComponent>;
  let mockPrescriptionService: jasmine.SpyObj<PrescriptionService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    // Mock services
    mockPrescriptionService = jasmine.createSpyObj('PrescriptionService', ['getPrescriptionsByPatientId']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['validateToken', 'getCurrentUser', 'getAuthHeaders']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['goBack']);

    // Mock method behaviors
    mockAuthService.validateToken.and.returnValue(true);
    mockAuthService.getCurrentUser.and.returnValue({ id: '123', username: 'user1', role: 'Patient' });
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders({ Authorization: 'Bearer token' }));

    mockPrescriptionService.getPrescriptionsByPatientId.and.returnValue(
      of({
        items: [
          {
            prescriptionId: '1',
            patientId: '123',
            medicationName: 'Medicine A',
            dosage: '10mg',
            frequency: 'Once a day',
            startDate: new Date().toISOString(), // Convert to ISO string
            endDate: new Date().toISOString(),   // Convert to ISO string
            notes: 'Take with food'
          },
          {
            prescriptionId: '2',
            patientId: '123',
            medicationName: 'Medicine B',
            dosage: '5mg',
            frequency: 'Twice a day',
            startDate: new Date().toISOString(), // Convert to ISO string
            endDate: new Date().toISOString(),   // Convert to ISO string
            notes: 'Take before meals'
          }
        ],
        totalCount: 2,
        page: 1,
        pageSize: 10
      })
    );


    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule, FormsModule],
      declarations: [UserGetPrescriptionsComponent],
      providers: [
        { provide: PrescriptionService, useValue: mockPrescriptionService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: NavigationService, useValue: mockNavigationService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserGetPrescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to login if token is invalid', () => {
    mockAuthService.validateToken.and.returnValue(false);
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should load prescriptions on init', () => {
    component.ngOnInit();
    expect(mockPrescriptionService.getPrescriptionsByPatientId).toHaveBeenCalledWith('123', component.page, component.size, {
      headers: new HttpHeaders({ Authorization: 'Bearer token' })
    });
    expect(component.prescriptions.length).toBe(2);
    expect(component.totalCount).toBe(2);
  });

  it('should handle error when loading prescriptions', () => {
    spyOn(console, 'error');
    mockPrescriptionService.getPrescriptionsByPatientId.and.returnValue(throwError(() => new Error('Error loading prescriptions')));

    component.loadPrescriptions();

    expect(component.error).toBe('Failed to load prescriptions');
    expect(console.error).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should set error if user information is missing', () => {
    mockAuthService.getCurrentUser.and.returnValue(null);
    component.loadPrescriptions();
    expect(component.error).toBe('User information not found');
  });

  it('should correctly determine the last page', () => {
    component.totalCount = 20;
    component.page = 2;
    component.size = 10;
    expect(component.isLastPage()).toBeTrue();

    component.page = 1;
    expect(component.isLastPage()).toBeFalse();
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockNavigationService.goBack).toHaveBeenCalled();
  });
});
