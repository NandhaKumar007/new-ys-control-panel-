import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveProductsComponent } from './archive-products.component';

describe('ArchiveProductsComponent', () => {
  let component: ArchiveProductsComponent;
  let fixture: ComponentFixture<ArchiveProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
