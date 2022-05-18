import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorForgotPwdComponent } from './vendor-forgot-pwd.component';

describe('VendorForgotPwdComponent', () => {
  let component: VendorForgotPwdComponent;
  let fixture: ComponentFixture<VendorForgotPwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorForgotPwdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorForgotPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
