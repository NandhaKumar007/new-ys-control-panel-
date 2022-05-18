import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraPagesSeoComponent } from './extra-pages-seo.component';

describe('ExtraPagesSeoComponent', () => {
  let component: ExtraPagesSeoComponent;
  let fixture: ComponentFixture<ExtraPagesSeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraPagesSeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraPagesSeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
