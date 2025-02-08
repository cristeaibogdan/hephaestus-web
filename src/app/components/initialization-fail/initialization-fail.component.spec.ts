import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitializationFailComponent } from './initialization-fail.component';

describe('WakeupComponent', () => {
  let component: InitializationFailComponent;
  let fixture: ComponentFixture<InitializationFailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitializationFailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitializationFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
