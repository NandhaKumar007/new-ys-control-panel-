import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyAddonsComponent } from './modify-addons.component';

describe('ModifyAddonsComponent', () => {
  let component: ModifyAddonsComponent;
  let fixture: ComponentFixture<ModifyAddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyAddonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyAddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
