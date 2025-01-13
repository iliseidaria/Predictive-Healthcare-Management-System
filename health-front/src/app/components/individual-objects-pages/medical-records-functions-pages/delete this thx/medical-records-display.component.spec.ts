import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRecordsDisplayComponent } from './medical-records-display.component';

describe('MedicalRecordsDisplayComponent', () => {
  let component: MedicalRecordsDisplayComponent;
  let fixture: ComponentFixture<MedicalRecordsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalRecordsDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalRecordsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
