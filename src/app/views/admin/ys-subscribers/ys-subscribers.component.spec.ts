import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YsSubscribersComponent } from './ys-subscribers.component';

describe('YsSubscribersComponent', () => {
  let component: YsSubscribersComponent;
  let fixture: ComponentFixture<YsSubscribersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YsSubscribersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YsSubscribersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
