import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraPagesComponent } from './extra-pages.component';

describe('ExtraPagesComponent', () => {
  let component: ExtraPagesComponent;
  let fixture: ComponentFixture<ExtraPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraPagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
