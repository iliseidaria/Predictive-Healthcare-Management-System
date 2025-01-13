import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGetPrescriptionsComponent } from './user-get-prescriptions.component';

describe('UserGetPrescriptionsComponent', () => {
  let component: UserGetPrescriptionsComponent;
  let fixture: ComponentFixture<UserGetPrescriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserGetPrescriptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserGetPrescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
