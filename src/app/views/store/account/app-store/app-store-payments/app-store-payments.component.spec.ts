import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppStorePaymentsComponent } from './app-store-payments.component';

describe('AppStorePaymentsComponent', () => {
  let component: AppStorePaymentsComponent;
  let fixture: ComponentFixture<AppStorePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppStorePaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppStorePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
