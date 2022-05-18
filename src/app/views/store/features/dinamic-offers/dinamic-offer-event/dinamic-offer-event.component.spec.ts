import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinamicOfferEventComponent } from './dinamic-offer-event.component';

describe('DinamicOfferEventComponent', () => {
  let component: DinamicOfferEventComponent;
  let fixture: ComponentFixture<DinamicOfferEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DinamicOfferEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DinamicOfferEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
