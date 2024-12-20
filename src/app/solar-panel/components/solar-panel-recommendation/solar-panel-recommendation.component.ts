import { Component } from '@angular/core';
import { SolarPanelService } from '../../services/solar-panel.service';
import { Observable } from 'rxjs';
import { SolarPanelIdentification } from '../../models/solar-panel-identification.model';
import { SolarPanelDataService } from '../../services/solar-panel-data.service';
import { SolarPanelRecommendation } from '../../enums/solar-panel-recommendation.enum';

@Component({
  selector: 'app-solar-panel-recommendation',
  templateUrl: './solar-panel-recommendation.component.html',
  styleUrls: ['./solar-panel-recommendation.component.scss']
})
export class SolarPanelRecommendationComponent {

  solarPanelIdenfitication$: Observable<SolarPanelIdentification> = this._solarPanelService.getSolarPanelIdentification();
  serialNumber :string = this._solarPanelService.getSerialNumber();
  solarPanelRecommendation :SolarPanelRecommendation = this._solarPanelService.getRecommendation();;

  constructor(
    private _solarPanelService: SolarPanelService,
    private _solarPanelDataService: SolarPanelDataService
  ) { }

  onDownload() {
    this._solarPanelDataService.getReport(this.serialNumber);
  }

}
