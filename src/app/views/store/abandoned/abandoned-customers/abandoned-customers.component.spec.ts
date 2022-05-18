import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbandonedCustomersComponent } from './abandoned-customers.component';

describe('AbandonedCustomersComponent', () => {
  let component: AbandonedCustomersComponent;
  let fixture: ComponentFixture<AbandonedCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbandonedCustomersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbandonedCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
