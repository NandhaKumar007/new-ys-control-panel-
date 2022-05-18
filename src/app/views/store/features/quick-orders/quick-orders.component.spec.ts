import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickOrdersComponent } from './quick-orders.component';

describe('QuickOrdersComponent', () => {
  let component: QuickOrdersComponent;
  let fixture: ComponentFixture<QuickOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
