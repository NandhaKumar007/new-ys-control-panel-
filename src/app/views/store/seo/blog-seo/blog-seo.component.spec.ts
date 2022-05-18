import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogSeoComponent } from './blog-seo.component';

describe('BlogSeoComponent', () => {
  let component: BlogSeoComponent;
  let fixture: ComponentFixture<BlogSeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogSeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogSeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
