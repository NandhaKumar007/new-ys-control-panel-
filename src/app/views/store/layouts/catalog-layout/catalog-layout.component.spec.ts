import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogLayoutComponent } from './catalog-layout.component';

describe('CatalogLayoutComponent', () => {
  let component: CatalogLayoutComponent;
  let fixture: ComponentFixture<CatalogLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
