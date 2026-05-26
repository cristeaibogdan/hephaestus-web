import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarPanelDamageComponent } from './solar-panel-damage.component';

describe('SolarPanelDamageComponent', () => {
  let component: SolarPanelDamageComponent;
  let fixture: ComponentFixture<SolarPanelDamageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolarPanelDamageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarPanelDamageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
