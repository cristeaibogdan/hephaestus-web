import { Component, Inject } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-solar-panel-recommendation',
  templateUrl: './solar-panel-recommendation.component.html',
  styleUrls: ['./solar-panel-recommendation.component.css']
})
export class SolarPanelRecommendationComponent {
  constructor(
    @Inject(MatStepper) private stepper: MatStepper
  ) { }

  navigateToPreviousStep() {
    this.stepper.previous();
  }
}
