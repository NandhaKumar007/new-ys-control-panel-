import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveGiftcardOrdersComponent } from './inactive-giftcard-orders.component';

describe('InactiveGiftcardOrdersComponent', () => {
  let component: InactiveGiftcardOrdersComponent;
  let fixture: ComponentFixture<InactiveGiftcardOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InactiveGiftcardOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveGiftcardOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
