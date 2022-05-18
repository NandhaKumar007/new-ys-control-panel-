import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyYsFeaturesComponent } from './modify-ys-features.component';

describe('ModifyYsFeaturesComponent', () => {
  let component: ModifyYsFeaturesComponent;
  let fixture: ComponentFixture<ModifyYsFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyYsFeaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyYsFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
