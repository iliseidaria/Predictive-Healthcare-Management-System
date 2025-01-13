import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionForUserComponent } from './prescription-for-user.component';

describe('PrescriptionForUserComponent', () => {
  let component: PrescriptionForUserComponent;
  let fixture: ComponentFixture<PrescriptionForUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriptionForUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrescriptionForUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
