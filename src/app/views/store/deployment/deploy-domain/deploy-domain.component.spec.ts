import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeployDomainComponent } from './deploy-domain.component';

describe('DeployDomainComponent', () => {
  let component: DeployDomainComponent;
  let fixture: ComponentFixture<DeployDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeployDomainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
