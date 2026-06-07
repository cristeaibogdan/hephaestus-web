import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationStep } from './recommendation.step';

describe('SolarPanelRecommendationComponent', () => {
  let component: RecommendationStep;
  let fixture: ComponentFixture<RecommendationStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendationStep ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendationStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
