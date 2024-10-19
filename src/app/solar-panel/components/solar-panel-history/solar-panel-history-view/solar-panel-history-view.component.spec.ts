import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarPanelHistoryViewComponent } from './solar-panel-history-view.component';

describe('SolarPanelHistoryViewComponent', () => {
  let component: SolarPanelHistoryViewComponent;
  let fixture: ComponentFixture<SolarPanelHistoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolarPanelHistoryViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarPanelHistoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
