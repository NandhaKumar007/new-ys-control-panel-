import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YsClientsComponent } from './ys-clients.component';

describe('YsClientsComponent', () => {
  let component: YsClientsComponent;
  let fixture: ComponentFixture<YsClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YsClientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YsClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
