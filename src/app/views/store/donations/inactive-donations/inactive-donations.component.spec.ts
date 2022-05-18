import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveDonationsComponent } from './inactive-donations.component';

describe('InactiveDonationsComponent', () => {
  let component: InactiveDonationsComponent;
  let fixture: ComponentFixture<InactiveDonationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InactiveDonationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveDonationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
