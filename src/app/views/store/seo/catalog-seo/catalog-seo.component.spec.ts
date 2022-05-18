import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogSeoComponent } from './catalog-seo.component';

describe('CatalogSeoComponent', () => {
  let component: CatalogSeoComponent;
  let fixture: ComponentFixture<CatalogSeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogSeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogSeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
