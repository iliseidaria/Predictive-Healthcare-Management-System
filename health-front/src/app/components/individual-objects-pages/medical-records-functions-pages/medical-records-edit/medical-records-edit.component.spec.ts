import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRecordsEditComponent } from './medical-records-edit.component';

describe('MedicalRecordsEditComponent', () => {
  let component: MedicalRecordsEditComponent;
  let fixture: ComponentFixture<MedicalRecordsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalRecordsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalRecordsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
