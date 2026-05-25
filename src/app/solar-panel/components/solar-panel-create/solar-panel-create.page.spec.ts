import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarPanelCreatePage } from './solar-panel-create.page';

describe('SolarPanelCreatePage', () => {
  let component: SolarPanelCreatePage;
  let fixture: ComponentFixture<SolarPanelCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolarPanelCreatePage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarPanelCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
