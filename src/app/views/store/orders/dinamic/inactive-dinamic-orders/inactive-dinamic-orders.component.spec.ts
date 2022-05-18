import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveDinamicOrdersComponent } from './inactive-dinamic-orders.component';

describe('InactiveDinamicOrdersComponent', () => {
  let component: InactiveDinamicOrdersComponent;
  let fixture: ComponentFixture<InactiveDinamicOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InactiveDinamicOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveDinamicOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
