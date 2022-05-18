import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestUsersComponent } from './guest-users.component';

describe('GuestUsersComponent', () => {
  let component: GuestUsersComponent;
  let fixture: ComponentFixture<GuestUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
