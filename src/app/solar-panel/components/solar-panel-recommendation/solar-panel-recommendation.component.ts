import { Component } from '@angular/core';
import { SolarPanelService } from '../../services/solar-panel.service';
import { Observable } from 'rxjs';
import { SolarPanelIdentification } from '../../models/solar-panel-identification.model';

@Component({
  selector: 'app-solar-panel-recommendation',
  templateUrl: './solar-panel-recommendation.component.html',
  styleUrls: ['./solar-panel-recommendation.component.css']
})
export class SolarPanelRecommendationComponent {

  solarPanelIdenfitication$: Observable<SolarPanelIdentification> = this._solarPanelService.getSolarPanelIdentification();
  serialNumber :string = this._solarPanelService.getSerialNumber();
  solarPanelRecommendation :any = "Placeholder";

  constructor(
    private _solarPanelService: SolarPanelService
  ) { }

}
