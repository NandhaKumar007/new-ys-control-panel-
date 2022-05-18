import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinamicOffersComponent } from './dinamic-offers.component';

describe('DinamicOffersComponent', () => {
  let component: DinamicOffersComponent;
  let fixture: ComponentFixture<DinamicOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DinamicOffersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DinamicOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
