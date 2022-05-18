import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpWalletMgmtComponent } from './dp-wallet-mgmt.component';

describe('DpWalletMgmtComponent', () => {
  let component: DpWalletMgmtComponent;
  let fixture: ComponentFixture<DpWalletMgmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DpWalletMgmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DpWalletMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
