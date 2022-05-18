import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTaxonomyComponent } from './product-taxonomy.component';

describe('ProductTaxonomyComponent', () => {
  let component: ProductTaxonomyComponent;
  let fixture: ComponentFixture<ProductTaxonomyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductTaxonomyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTaxonomyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
