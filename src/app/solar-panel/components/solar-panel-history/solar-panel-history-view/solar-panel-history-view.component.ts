import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GetSolarPanelFullResponse } from 'src/app/solar-panel/models/dtos/get-solar-panel-full-response.dto';

@Component({
  selector: 'app-solar-panel-history-view',
  templateUrl: './solar-panel-history-view.component.html',
  styleUrls: ['./solar-panel-history-view.component.css']
})
export class SolarPanelHistoryViewComponent {

  solarPanel: GetSolarPanelFullResponse = this.data.solarPanel;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data:any
  ) {}
}
