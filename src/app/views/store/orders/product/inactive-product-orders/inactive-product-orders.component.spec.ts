import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveProductOrdersComponent } from './inactive-product-orders.component';

describe('InactiveProductOrdersComponent', () => {
  let component: InactiveProductOrdersComponent;
  let fixture: ComponentFixture<InactiveProductOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InactiveProductOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveProductOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
