import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GetSolarPanelFullResponse } from '../../models/dtos/get-solar-panel-full-response.dto';

@Component({
  selector: 'app-solar-panel-history',
  templateUrl: './solar-panel-history.component.html',
  styleUrls: ['./solar-panel-history.component.css']
})
export class SolarPanelHistoryComponent {

  solarPanels = new MatTableDataSource<Partial<GetSolarPanelFullResponse>>();

}
