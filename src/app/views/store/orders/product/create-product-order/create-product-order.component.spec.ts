import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductOrderComponent } from './create-product-order.component';

describe('CreateProductOrderComponent', () => {
  let component: CreateProductOrderComponent;
  let fixture: ComponentFixture<CreateProductOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProductOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
