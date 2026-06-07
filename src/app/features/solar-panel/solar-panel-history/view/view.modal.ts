import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslocoModule } from '@jsverse/transloco';
import { GetSolarPanelFullResponse } from '../../models/endpoints/get-solar-panel-full.endpoint';
import { SolarPanelApi } from '../../solar-panel.api';

@Component({
    selector: 'app-view',
    templateUrl: './view.modal.html',
    styleUrls: ['./view.modal.scss'],
    imports: [
      CommonModule,
      TranslocoModule,

      MatDialogModule,
      MatButtonModule
    ]
})
export class ViewModal {
  private data = inject(MAT_DIALOG_DATA);
  private _solarPanelApi = inject(SolarPanelApi);

  solarPanel: GetSolarPanelFullResponse = this.data.solarPanel;

  onDownload() {
    this._solarPanelApi.getReport("to implement");
  }
}
