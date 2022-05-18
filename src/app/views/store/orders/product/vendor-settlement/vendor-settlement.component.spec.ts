import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSettlementComponent } from './vendor-settlement.component';

describe('VendorSettlementComponent', () => {
  let component: VendorSettlementComponent;
  let fixture: ComponentFixture<VendorSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorSettlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
