import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbandonedDetailsComponent } from './abandoned-details.component';

describe('AbandonedDetailsComponent', () => {
  let component: AbandonedDetailsComponent;
  let fixture: ComponentFixture<AbandonedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbandonedDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbandonedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
