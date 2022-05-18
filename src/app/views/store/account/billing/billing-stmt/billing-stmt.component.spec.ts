import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingStmtComponent } from './billing-stmt.component';

describe('BillingStmtComponent', () => {
  let component: BillingStmtComponent;
  let fixture: ComponentFixture<BillingStmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingStmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingStmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
