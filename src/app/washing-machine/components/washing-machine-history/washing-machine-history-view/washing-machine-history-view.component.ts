import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from "@angular/material/legacy-dialog";
import { NotificationService } from 'src/app/services/notification.service';
import { GetWashingMachineFullResponse } from 'src/app/washing-machine/models/dtos/get-washing-machine-full.response';
import { WashingMachineDataService } from 'src/app/washing-machine/services/washing-machine.data.service';

@Component({
  selector: 'app-washing-machine-history-view',
  templateUrl: './washing-machine-history-view.component.html',
  styleUrls: ['./washing-machine-history-view.component.scss']
})
export class WashingMachineHistoryViewComponent {

  washingMachine: GetWashingMachineFullResponse = this.data.washingMachine;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data:any,
    private _washingMachineDataService:WashingMachineDataService,
    private _notifService:NotificationService
  ) {}

  onDownload(): void {
    this._washingMachineDataService.getReport(this.washingMachine.serialNumber).subscribe(response => {

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