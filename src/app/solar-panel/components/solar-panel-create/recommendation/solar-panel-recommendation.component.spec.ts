import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarPanelRecommendationComponent } from './solar-panel-recommendation.component';

describe('SolarPanelRecommendationComponent', () => {
  let component: SolarPanelRecommendationComponent;
  let fixture: ComponentFixture<SolarPanelRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolarPanelRecommendationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarPanelRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
