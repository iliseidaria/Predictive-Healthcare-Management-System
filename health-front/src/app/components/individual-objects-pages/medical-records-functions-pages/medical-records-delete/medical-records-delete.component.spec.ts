import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRecordsDeleteComponent } from './medical-records-delete.component';

describe('MedicalRecordsDeleteComponent', () => {
  let component: MedicalRecordsDeleteComponent;
  let fixture: ComponentFixture<MedicalRecordsDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalRecordsDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalRecordsDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
