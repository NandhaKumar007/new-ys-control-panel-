import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinamicOrderDetailsComponent } from './dinamic-order-details.component';

describe('DinamicOrderDetailsComponent', () => {
  let component: DinamicOrderDetailsComponent;
  let fixture: ComponentFixture<DinamicOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DinamicOrderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DinamicOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
