import { Component, inject } from '@angular/core';
import { EMPTY, Observable, switchMap, take } from 'rxjs';
import { WashingMachineService } from '../../services/washing-machine.service';
import { WashingMachineDataService } from '../../services/washing-machine.data.service';
import { NotificationService } from 'src/app/services/notification.service';
import { WashingMachineIdentification } from '../../models/washing-machine-identification.model';
import { Recommendation } from '../../enums/recommendation.enum';
import { MatButtonModule } from '@angular/material/button';
import { WashingMachineOverviewComponent } from '../washing-machine-overview/washing-machine-overview.component';
import { TranslocoModule } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { StepperButtonsDirective } from 'src/app/shared/directives/stepper-buttons.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-washing-machine-recommendation',
  templateUrl: './washing-machine-recommendation.component.html',
  styleUrls: ['./washing-machine-recommendation.component.scss'],
  imports: [
    MatButtonModule,

    CommonModule,
    RouterLink,
    TranslocoModule,
    WashingMachineOverviewComponent,
    StepperButtonsDirective
  ]
})
export class WashingMachineRecommendationComponent {
  private _washingMachineService = inject(WashingMachineService);
  private _washingMachineDataService = inject(WashingMachineDataService);
  private _notifService = inject(NotificationService);

  washingMachineIdentification$:Observable<WashingMachineIdentification | null> = this._washingMachineService.getWashingMachineIdentification();
  washingMachineRecommendation :Recommendation = this._washingMachineService.getRecommendation();

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
  