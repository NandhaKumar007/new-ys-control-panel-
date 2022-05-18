import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSubCategoriesComponent } from './menu-sub-categories.component';

describe('MenuSubCategoriesComponent', () => {
  let component: MenuSubCategoriesComponent;
  let fixture: ComponentFixture<MenuSubCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuSubCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSubCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
