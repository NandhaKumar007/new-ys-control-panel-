import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyCouponCodeComponent } from './modify-coupon-code.component';

describe('ModifyCouponCodeComponent', () => {
  let component: ModifyCouponCodeComponent;
  let fixture: ComponentFixture<ModifyCouponCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyCouponCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyCouponCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
