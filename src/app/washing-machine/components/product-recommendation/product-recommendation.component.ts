import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WashingMachineService } from '../../services/washing-machine.service';
import { WashingMachineDataService } from '../../services/washing-machine.data.service';
import { NotificationService } from 'src/app/services/notification.service';
import { WashingMachineIdentification } from '../../models/washing-machine-identification.model';
import { Recommendation } from '../../enums/recommendation.enum';

@Component({
  selector: 'app-product-recommendation',
  templateUrl: './product-recommendation.component.html',
  styleUrls: ['./product-recommendation.component.css']
})
export class ProductRecommendationComponent implements OnInit {

  washingMachineIdentification$:Observable<WashingMachineIdentification> = this._washingMachineService.getWashingMachineIdentification();
  serialNumber :string = this._washingMachineService.getSerialNumber();
  washingMachineRecommendation! :Recommendation;

  constructor(
    private _washingMachineService: WashingMachineService,
    private _washingMachineDataService: WashingMachineDataService,
    private _notifService: NotificationService
  ) { }
  
  ngOnInit() { //TODO: What happens if the internet is down ? How to retry?
    this._washingMachineDataService.getRecommendation(this.serialNumber).subscribe(response => {
      this.washingMachineRecommendation = response;
    });
  }

// **********************************
// *** DOWNLOAD FILE FUNCTIONALITY
// **********************************

  onDownload() {    
    this._washingMachineDataService.getReport(this.serialNumber).subscribe(response => {

      // Convert to blob
      const arraybuffer = this._notifService.base64ToArrayBuffer(response.report);
      const blob = new Blob([arraybuffer], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);

      // Open new tab with file
      window.open(blobUrl, '_blank');

      // Format createdAt date
      const formattedDate = response.createdAt.slice(0,-7);

      // Download the file
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = 'Recommendation Report_' + formattedDate + '.pdf';
      downloadLink.click();      
    });
  }
}
  