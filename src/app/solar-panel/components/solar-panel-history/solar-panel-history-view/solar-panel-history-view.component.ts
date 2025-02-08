import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslocoModule } from '@jsverse/transloco';
import { GetSolarPanelFullResponse } from 'src/app/solar-panel/models/dtos/get-solar-panel-full.response';
import { SolarPanelDataService } from 'src/app/solar-panel/services/solar-panel-data.service';

@Component({
    selector: 'app-solar-panel-history-view',
    templateUrl: './solar-panel-history-view.component.html',
    styleUrls: ['./solar-panel-history-view.component.scss'],
    imports: [
      CommonModule,
      TranslocoModule,
      
      MatDialogModule,
      MatButtonModule
    ]
})
export class SolarPanelHistoryViewComponent {
  private data = inject(MAT_DIALOG_DATA);
  private _solarPanelDataService = inject(SolarPanelDataService);

  solarPanel: GetSolarPanelFullResponse = this.data.solarPanel;

  onDownload() {
    this._solarPanelDataService.getReport("to implement");
  }
}
