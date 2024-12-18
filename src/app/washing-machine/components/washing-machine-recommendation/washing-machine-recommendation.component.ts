import { Component } from '@angular/core';
import { EMPTY, Observable, switchMap, take } from 'rxjs';
import { WashingMachineService } from '../../services/washing-machine.service';
import { WashingMachineDataService } from '../../services/washing-machine.data.service';
import { NotificationService } from 'src/app/services/notification.service';
import { WashingMachineIdentification } from '../../models/washing-machine-identification.model';
import { Recommendation } from '../../enums/recommendation.enum';

@Component({
  selector: 'app-washing-machine-recommendation',
  templateUrl: './washing-machine-recommendation.component.html',
  styleUrls: ['./washing-machine-recommendation.component.scss']
})
export class WashingMachineRecommendationComponent {

  washingMachineIdentification$:Observable<WashingMachineIdentification | null> = this._washingMachineService.getWashingMachineIdentification();
  washingMachineRecommendation :Recommendation = this._washingMachineService.getRecommendation();

  constructor(
    private _washingMachineService: WashingMachineService,
    private _washingMachineDataService: WashingMachineDataService,
    private _notifService: NotificationService
  ) { }

// **********************************
// *** DOWNLOAD FILE FUNCTIONALITY
// **********************************

  onDownload(): void {
    this.washingMachineIdentification$.pipe(
      take(1),
      switchMap(washingMachineIdentification => {
        if(!washingMachineIdentification) {
          return EMPTY;
        }
        return this._washingMachineDataService.getReport(washingMachineIdentification!.serialNumber)
      })
    ).subscribe(response => {
      
      // Convert to blob
      const arraybuffer = this._notifService.base64ToArrayBuffer(response.report);
      const blob = new Blob([arraybuffer], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);

      // Format createdAt date
      const formattedDate = response.createdAt.slice(0,-7);

      // Download the file
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = 'Recommendation Report_' + formattedDate + '.pdf';
      downloadLink.click();
      
      // Open new tab with file
      window.open(blobUrl, '_blank');

      // Cleanup
      window.URL.revokeObjectURL(blobUrl);
    });
  }
}
  