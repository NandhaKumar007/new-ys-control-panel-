import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VsOrderDetailsComponent } from './vs-order-details.component';

describe('VsOrderDetailsComponent', () => {
  let component: VsOrderDetailsComponent;
  let fixture: ComponentFixture<VsOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VsOrderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VsOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
