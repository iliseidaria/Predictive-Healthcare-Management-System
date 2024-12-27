import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentGetAllComponent } from './appointment-get-all.component';

describe('AppointmentGetAllComponent', () => {
  let component: AppointmentGetAllComponent;
  let fixture: ComponentFixture<AppointmentGetAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentGetAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentGetAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
