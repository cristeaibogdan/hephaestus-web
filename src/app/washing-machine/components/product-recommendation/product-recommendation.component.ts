import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { WashingMachineService } from 'src/app/services/washing-machine.service';
import { DataService } from 'src/app/services/data.service';
import { WashingMachineDTO } from 'src/app/components/models/dtos/washing-machine.dto';

@Component({
  selector: 'app-product-recommendation',
  templateUrl: './product-recommendation.component.html',
  styleUrls: ['./product-recommendation.component.css']
})
export class ProductRecommendationComponent {

  washingMachine$:Observable<WashingMachineDTO> = this._washingMachineService.getWashingMachine();

  constructor(
    private _washingMachineService: WashingMachineService,
    private _dataService:DataService,
  ) { }

// **********************************
// *** DOWNLOAD FILE FUNCTIONALITY
// **********************************

  serialNumber:string = this._washingMachineService.getSerialNumber();

  onDownload() {    
    this._dataService.getReport(this.serialNumber).subscribe(response => {

      // Convert to blob
      const arraybuffer = this._dataService.base64ToArrayBuffer(response.report);
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
  