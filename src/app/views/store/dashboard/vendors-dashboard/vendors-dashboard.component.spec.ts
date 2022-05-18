import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsDashboardComponent } from './vendors-dashboard.component';

describe('VendorsDashboardComponent', () => {
  let component: VendorsDashboardComponent;
  let fixture: ComponentFixture<VendorsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorsDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
