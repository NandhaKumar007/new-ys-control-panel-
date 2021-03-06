import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootNoteComponent } from './foot-note.component';

describe('FootNoteComponent', () => {
  let component: FootNoteComponent;
  let fixture: ComponentFixture<FootNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FootNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FootNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
