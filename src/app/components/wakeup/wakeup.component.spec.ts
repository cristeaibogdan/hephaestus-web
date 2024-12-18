import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WakeupComponent } from './wakeup.component';

describe('WakeupComponent', () => {
  let component: WakeupComponent;
  let fixture: ComponentFixture<WakeupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WakeupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WakeupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
