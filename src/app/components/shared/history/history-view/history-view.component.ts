import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { WashingMachineDTO } from 'src/app/components/models/dtos/washing-machine.dto';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-history-view',
  templateUrl: './history-view.component.html',
  styleUrls: ['./history-view.component.css']
})
export class HistoryViewComponent implements OnInit {

  washingMachine:WashingMachineDTO = this.data.washingMachine;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data:any,
    private _dataService:DataService
  ) {}

  ngOnInit() { }

  onDownload() {
    this._dataService.getReport(this.washingMachine.serialNumber).subscribe(response => {

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
      downloadLink.download = 'Recommendation Report_'+formattedDate+'.pdf';
      downloadLink.click();      
    });
  }
}



