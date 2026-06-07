import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslocoModule } from '@jsverse/transloco';
import { ToLabelPipe } from 'src/app/shared/pipes/to-label.pipe';
import { GetWashingMachineFullResponse } from '../../models/endpoints/get-washing-machine-full.endpoint';
import { WashingMachineApi } from '../../washing-machine.api';
import {NotificationService} from "../../../../shared/services/notification.service";

@Component({
  selector: 'app-view',
  templateUrl: './view.modal.html',
  styleUrls: ['./view.modal.scss'],
  imports: [
    CommonModule,
    TranslocoModule,
    ToLabelPipe,

    MatDialogModule,
    MatButtonModule
  ]
})
export class ViewModal {
  private data = inject(MAT_DIALOG_DATA);
  private _washingMachineApi = inject(WashingMachineApi);
  private _notifService = inject(NotificationService);

  washingMachine: GetWashingMachineFullResponse = this.data.washingMachine;

  onDownload(): void {
    this._washingMachineApi.getReport(this.washingMachine.serialNumber).subscribe(response => {

      // Convert to blob
      const arraybuffer = this._notifService.base64ToArrayBuffer(response.report);
      const blob = new Blob([arraybuffer], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);

      // Format createdAt date
      const formattedDate = response.createdAt.slice(0,-7);

      // Download the file
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = 'Recommendation Report_'+formattedDate+'.pdf';
      downloadLink.click();

      // Open new tab with file
      window.open(blobUrl, '_blank');

      // Cleanup
      window.URL.revokeObjectURL(blobUrl);
    });
  }
}
