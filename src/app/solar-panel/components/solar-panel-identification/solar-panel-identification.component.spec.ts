import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarPanelIdentificationComponent } from './solar-panel-identification.component';

describe('SolarPanelIdentificationComponent', () => {
  let component: SolarPanelIdentificationComponent;
  let fixture: ComponentFixture<SolarPanelIdentificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolarPanelIdentificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarPanelIdentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
