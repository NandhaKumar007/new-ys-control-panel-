import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorPwdRecoveryComponent } from './vendor-pwd-recovery.component';

describe('VendorPwdRecoveryComponent', () => {
  let component: VendorPwdRecoveryComponent;
  let fixture: ComponentFixture<VendorPwdRecoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorPwdRecoveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorPwdRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
