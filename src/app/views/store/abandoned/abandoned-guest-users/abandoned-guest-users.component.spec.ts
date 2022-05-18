import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbandonedGuestUsersComponent } from './abandoned-guest-users.component';

describe('AbandonedGuestUsersComponent', () => {
  let component: AbandonedGuestUsersComponent;
  let fixture: ComponentFixture<AbandonedGuestUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbandonedGuestUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbandonedGuestUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
