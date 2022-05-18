import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSeoComponent } from './product-seo.component';

describe('ProductSeoComponent', () => {
  let component: ProductSeoComponent;
  let fixture: ComponentFixture<ProductSeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
