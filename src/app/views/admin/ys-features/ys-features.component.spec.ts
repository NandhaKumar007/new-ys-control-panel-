import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YsFeaturesComponent } from './ys-features.component';

describe('YsFeaturesComponent', () => {
  let component: YsFeaturesComponent;
  let fixture: ComponentFixture<YsFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YsFeaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YsFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
