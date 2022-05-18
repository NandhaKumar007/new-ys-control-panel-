import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinamicOrdersComponent } from './dinamic-orders.component';

describe('DinamicOrdersComponent', () => {
  let component: DinamicOrdersComponent;
  let fixture: ComponentFixture<DinamicOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DinamicOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DinamicOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
