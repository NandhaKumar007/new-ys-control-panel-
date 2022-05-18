import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifySizingAssistantComponent } from './modify-sizing-assistant.component';

describe('ModifySizingAssistantComponent', () => {
  let component: ModifySizingAssistantComponent;
  let fixture: ComponentFixture<ModifySizingAssistantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifySizingAssistantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifySizingAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
