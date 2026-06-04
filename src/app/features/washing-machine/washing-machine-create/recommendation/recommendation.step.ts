import { Component, inject, Signal } from '@angular/core';
import { WashingMachineCreateService } from '../washing-machine-create.service';
import { WashingMachineApi } from '../../washing-machine.api';
import { WashingMachineIdentification } from '../../models/washing-machine-identification.model';
import { Recommendation } from '../../enums/recommendation.enum';
import { MatButtonModule } from '@angular/material/button';
import { OverviewStep } from '../overview/overview.step';
import { TranslocoModule } from '@jsverse/transloco';
import { StepperButtonsDirective } from 'src/app/shared/directives/stepper-buttons.directive';
import { RouterLink } from '@angular/router';
import { NotificationService } from "../../../../shared/services/notification.service";

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.step.html',
  styleUrls: ['./recommendation.step.scss'],
  imports: [
    MatButtonModule,
    RouterLink,
    TranslocoModule,
    OverviewStep,
    StepperButtonsDirective
]
})
export class RecommendationStep {
  private _washingMachineCreateService = inject(WashingMachineCreateService);
  private _washingMachineApi = inject(WashingMachineApi);
  private _notifService = inject(NotificationService);

  washingMachineIdentification: Signal<WashingMachineIdentification> = this._washingMachineCreateService.getWashingMachineIdentification();
  washingMachineRecommendation: Recommendation = this._washingMachineCreateService.getRecommendation();

  onDownload(): void {
    this._washingMachineApi.getReport(this.washingMachineIdentification().serialNumber).subscribe(response => {
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
