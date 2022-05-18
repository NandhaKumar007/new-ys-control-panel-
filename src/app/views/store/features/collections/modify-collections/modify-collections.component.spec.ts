import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyCollectionsComponent } from './modify-collections.component';

describe('ModifyCollectionsComponent', () => {
  let component: ModifyCollectionsComponent;
  let fixture: ComponentFixture<ModifyCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyCollectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
