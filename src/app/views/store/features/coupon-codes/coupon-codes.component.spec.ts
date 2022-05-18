import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponCodesComponent } from './coupon-codes.component';

describe('CouponCodesComponent', () => {
  let component: CouponCodesComponent;
  let fixture: ComponentFixture<CouponCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponCodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
