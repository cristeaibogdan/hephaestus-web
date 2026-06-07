import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewStep } from './overview.step';

describe('SolarPanelOverviewComponent', () => {
  let component: OverviewStep;
  let fixture: ComponentFixture<OverviewStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverviewStep ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverviewStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
