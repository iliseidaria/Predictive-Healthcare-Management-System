import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionGetAllComponent } from './prescription-get-all.component';

describe('PrescriptionGetAllComponent', () => {
  let component: PrescriptionGetAllComponent;
  let fixture: ComponentFixture<PrescriptionGetAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriptionGetAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrescriptionGetAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
