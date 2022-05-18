import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyHomeLayoutComponent } from './modify-home-layout.component';

describe('ModifyHomeLayoutComponent', () => {
  let component: ModifyHomeLayoutComponent;
  let fixture: ComponentFixture<ModifyHomeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyHomeLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyHomeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
