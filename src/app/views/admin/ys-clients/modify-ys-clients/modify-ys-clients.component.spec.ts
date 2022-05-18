import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyYsClientsComponent } from './modify-ys-clients.component';

describe('ModifyYsClientsComponent', () => {
  let component: ModifyYsClientsComponent;
  let fixture: ComponentFixture<ModifyYsClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyYsClientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyYsClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
