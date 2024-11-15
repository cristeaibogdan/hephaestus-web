import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotificationService } from 'src/app/services/notification.service';
import { WashingMachineFullResponse } from 'src/app/washing-machine/models/dtos/washing-machine-full.response';
import { WashingMachineDataService } from 'src/app/washing-machine/services/washing-machine.data.service';

@Component({
  selector: 'app-history-view',
  templateUrl: './history-view.component.html',
  styleUrls: ['./history-view.component.css']
})
export class HistoryViewComponent {

  washingMachine: WashingMachineFullResponse = this.data.washingMachine;

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