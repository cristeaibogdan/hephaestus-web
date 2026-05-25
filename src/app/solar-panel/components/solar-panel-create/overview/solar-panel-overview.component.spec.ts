import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarPanelOverviewComponent } from './solar-panel-overview.component';

describe('SolarPanelOverviewComponent', () => {
  let component: SolarPanelOverviewComponent;
  let fixture: ComponentFixture<SolarPanelOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolarPanelOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarPanelOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
