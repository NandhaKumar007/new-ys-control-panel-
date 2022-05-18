import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftcardOrderDetailsComponent } from './giftcard-order-details.component';

describe('GiftcardOrderDetailsComponent', () => {
  let component: GiftcardOrderDetailsComponent;
  let fixture: ComponentFixture<GiftcardOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiftcardOrderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftcardOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
