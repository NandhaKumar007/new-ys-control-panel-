import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopAssistantComponent } from './shop-assistant.component';

describe('ShopAssistantComponent', () => {
  let component: ShopAssistantComponent;
  let fixture: ComponentFixture<ShopAssistantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopAssistantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
