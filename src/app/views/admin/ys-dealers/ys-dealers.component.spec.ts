import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YsDealersComponent } from './ys-dealers.component';

describe('YsDealersComponent', () => {
  let component: YsDealersComponent;
  let fixture: ComponentFixture<YsDealersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YsDealersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YsDealersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
