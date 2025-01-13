import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfileButtonComponent } from './view-profile-button.component';

describe('ViewProfileButtonComponent', () => {
  let component: ViewProfileButtonComponent;
  let fixture: ComponentFixture<ViewProfileButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProfileButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProfileButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
