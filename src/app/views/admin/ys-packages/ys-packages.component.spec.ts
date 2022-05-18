import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YsPackagesComponent } from './ys-packages.component';

describe('YsPackagesComponent', () => {
  let component: YsPackagesComponent;
  let fixture: ComponentFixture<YsPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YsPackagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YsPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
