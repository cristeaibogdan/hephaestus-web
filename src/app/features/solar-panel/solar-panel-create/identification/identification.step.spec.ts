import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentificationStep } from './identification.step';

describe('SolarPanelIdentificationComponent', () => {
  let component: IdentificationStep;
  let fixture: ComponentFixture<IdentificationStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentificationStep ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentificationStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
