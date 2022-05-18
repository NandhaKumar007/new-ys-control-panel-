import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftcardOrdersComponent } from './giftcard-orders.component';

describe('GiftcardOrdersComponent', () => {
  let component: GiftcardOrdersComponent;
  let fixture: ComponentFixture<GiftcardOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiftcardOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftcardOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
