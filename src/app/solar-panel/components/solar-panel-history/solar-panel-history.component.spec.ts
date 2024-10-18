import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarPanelHistoryComponent } from './solar-panel-history.component';

describe('SolarPanelHistoryComponent', () => {
  let component: SolarPanelHistoryComponent;
  let fixture: ComponentFixture<SolarPanelHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolarPanelHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarPanelHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
