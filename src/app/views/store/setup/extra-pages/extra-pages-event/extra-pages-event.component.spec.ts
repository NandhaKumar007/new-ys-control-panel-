import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraPagesEventComponent } from './extra-pages-event.component';

describe('ExtraPagesEventComponent', () => {
  let component: ExtraPagesEventComponent;
  let fixture: ComponentFixture<ExtraPagesEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraPagesEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraPagesEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
