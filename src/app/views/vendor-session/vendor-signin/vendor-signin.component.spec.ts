import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSigninComponent } from './vendor-signin.component';

describe('VendorSigninComponent', () => {
  let component: VendorSigninComponent;
  let fixture: ComponentFixture<VendorSigninComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorSigninComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
