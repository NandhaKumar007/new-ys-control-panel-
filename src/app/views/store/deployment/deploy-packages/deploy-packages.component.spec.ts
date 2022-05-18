import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeployPackagesComponent } from './deploy-packages.component';

describe('DeployPackagesComponent', () => {
  let component: DeployPackagesComponent;
  let fixture: ComponentFixture<DeployPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeployPackagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
