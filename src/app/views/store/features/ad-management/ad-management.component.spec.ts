import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdManagementComponent } from './ad-management.component';

describe('AdManagementComponent', () => {
  let component: AdManagementComponent;
  let fixture: ComponentFixture<AdManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
