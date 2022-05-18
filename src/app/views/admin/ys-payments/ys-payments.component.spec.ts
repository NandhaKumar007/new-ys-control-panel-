import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YsPaymentsComponent } from './ys-payments.component';

describe('YsPaymentsComponent', () => {
  let component: YsPaymentsComponent;
  let fixture: ComponentFixture<YsPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YsPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YsPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
