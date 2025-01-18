import { Component, inject } from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { SolarPanelService } from '../../services/solar-panel.service';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { StepperButtonsDirective } from 'src/app/shared/directives/stepper-buttons.directive';

@Component({
  selector: 'app-solar-panel-overview',
  templateUrl: './solar-panel-overview.component.html',
  styleUrls: ['./solar-panel-overview.component.scss'],
  imports: [
    MatButtonModule,
    MatStepperModule, // for the directive matStepperPrevious
    
    CommonModule,
    TranslocoModule,
    ReactiveFormsModule,
    StepperButtonsDirective
  ]
})
export class SolarPanelOverviewComponent {
  private stepper = inject(MatStepper);
  private _solarPanelService = inject(SolarPanelService);

  solarPanelIdenfitication$ = this._solarPanelService.getSolarPanelIdentification();
  solarPanelDamage$ = this._solarPanelService.getSolarPanelDamage();

  onNext() { //TODO: Use Promise to safely navigate to the next step
    this._solarPanelService.save();
    this.stepper.next();
  }
}
