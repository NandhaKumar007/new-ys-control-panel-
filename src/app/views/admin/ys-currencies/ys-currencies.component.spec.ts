import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YsCurrenciesComponent } from './ys-currencies.component';

describe('YsCurrenciesComponent', () => {
  let component: YsCurrenciesComponent;
  let fixture: ComponentFixture<YsCurrenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YsCurrenciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YsCurrenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
