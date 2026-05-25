import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarPanelHistoryPage } from './solar-panel-history.page';

describe('SolarPanelHistoryComponent', () => {
  let component: SolarPanelHistoryPage;
  let fixture: ComponentFixture<SolarPanelHistoryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolarPanelHistoryPage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarPanelHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
