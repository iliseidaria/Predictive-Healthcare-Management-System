import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersGetAllComponent } from './users-get-all.component';

describe('UsersGetAllComponent', () => {
  let component: UsersGetAllComponent;
  let fixture: ComponentFixture<UsersGetAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersGetAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersGetAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
