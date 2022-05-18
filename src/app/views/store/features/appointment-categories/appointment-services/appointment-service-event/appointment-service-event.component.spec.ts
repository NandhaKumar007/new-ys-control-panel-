import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentServiceEventComponent } from './appointment-service-event.component';

describe('AppointmentServiceEventComponent', () => {
  let component: AppointmentServiceEventComponent;
  let fixture: ComponentFixture<AppointmentServiceEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentServiceEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentServiceEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
