import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifySizeChartComponent } from './modify-size-chart.component';

describe('ModifySizeChartComponent', () => {
  let component: ModifySizeChartComponent;
  let fixture: ComponentFixture<ModifySizeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifySizeChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifySizeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
