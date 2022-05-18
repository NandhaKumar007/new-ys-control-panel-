import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSeoComponent } from './store-seo.component';

describe('StoreSeoComponent', () => {
  let component: StoreSeoComponent;
  let fixture: ComponentFixture<StoreSeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreSeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreSeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
