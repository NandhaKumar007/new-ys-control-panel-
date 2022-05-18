import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAuthLayoutComponent } from './vendor-auth-layout.component';

describe('VendorAuthLayoutComponent', () => {
  let component: VendorAuthLayoutComponent;
  let fixture: ComponentFixture<VendorAuthLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorAuthLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorAuthLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
