import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YsDashboardComponent } from './ys-dashboard.component';

describe('YsDashboardComponent', () => {
  let component: YsDashboardComponent;
  let fixture: ComponentFixture<YsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YsDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
