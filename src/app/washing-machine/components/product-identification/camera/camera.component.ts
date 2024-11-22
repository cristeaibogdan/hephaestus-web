import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BarcodeFormat } from '@zxing/library';
import { ɵunwrapSafeValue } from "@angular/core"
import { BrowserQRCodeReader } from '@zxing/browser/es2015/readers/BrowserQRCodeReader';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { MatDialogRef } from '@angular/material/dialog';
import { ImageFile } from 'src/app/washing-machine/models/image-file.model';
import { NotificationService } from 'src/app/services/notification.service';
import { WashingMachineDataService } from 'src/app/washing-machine/services/washing-machine.data.service';
import { GetProductIdentificationResponse } from 'src/app/shared/models/get-product-identification.response';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements AfterViewInit {

  constructor(
    private _notifService: NotificationService,
    private _washingMachineDataService: WashingMachineDataService,
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<CameraComponent>
  ) { }

//****************************************
//*** QR CODE CAMERA SCANNER 
//****************************************

  @ViewChild(ZXingScannerComponent)
  scanner!: ZXingScannerComponent;

  allowedFormats = [BarcodeFormat.QR_CODE];

  scannerEnabled:boolean = false;
  scanResult!:string;
  productIdentification!: GetProductIdentificationResponse;

  cameraIsLoading:boolean = false;
  cameraIsPaused:boolean = false;

  onStart(): void {
    if (this.cameraIsPaused) {
      // RESUME
      this.cameraIsLoading = false;
      this.resumeScan(); 
    } else if (this.scannerEnabled) {
      // STOP
      this.scannerEnabled = false; 
      this.resumeScan();     
    } else {
      // START
      this.cameraIsLoading = true;
      this.scannerEnabled = true;
    }

    // The if is to avoid the warning = Setting the same device is not allowed.
    if(this.scanner.device !== this.availableCameras[this.cameraIndex]) {
      this.scanner.device = this.availableCameras[this.cameraIndex];
    }

    // Clear previous result
    this.scanResult = "";
  }

  ngAfterViewInit(): void {
    this.scanner.previewElemRef.nativeElement.onloadeddata = (event) => {
      this.cameraIsLoading = false;
    };
  }

  onScanSuccess(result: string): void {
    this.scanResult = this.getProductIdentification(result);
    this.pauseScan(); 
    
    if(this.scanResult) {
      this._notifService.showSuccess("QR code succesfully identified!", 0);
    }
  }

  pauseScan(): void {
    // A. change the format from QR CODE to something else, this way the onScanSuccess() won't be triggered anymore
    // workaround to stop from scanning continuously after pausing the video
    this.cameraIsPaused = true;
    this.allowedFormats = [BarcodeFormat.AZTEC];  
    this.scanner.previewElemRef.nativeElement.pause();  
  }

  resumeScan(): void {
    // B. change the format to QR CODE so onScanSuccess() can be triggered again
    this.cameraIsPaused = false;
    this.allowedFormats = [BarcodeFormat.QR_CODE];
    this.scanner.previewElemRef.nativeElement.play();  
  }

  onClose(): void {
    if (this.productIdentification) {
      return this.dialogRef.close(this.productIdentification);
    }

    this.dialogRef.close();
  }

//****************************************
//*** SELECT CAMERA FOR SCANNING
//****************************************

  availableCameras!: MediaDeviceInfo[];
  cameraIndex: number = 0;

  switchCamera(): void {
    this.cameraIndex++;

    // if only one camera is present use it and exit method
    if (this.availableCameras.length === 1) {
      this.cameraIndex = 0;
      return;
    }

    // start from 0 if reached last camera
    if (this.availableCameras.length === this.cameraIndex) {
      this.cameraIndex = 0;
    }

    if(this.scannerEnabled) {
      // in case user changes camera when video is paused
      this.resumeScan();
      // The loading indicator will start only if scannerEnabled is true
      this.cameraIsLoading = true;
    }
    
    this.scanner.device = this.availableCameras[this.cameraIndex];  
  }

  camerasFoundHandler(foundCameras: MediaDeviceInfo[]): void {  
    this.availableCameras = foundCameras;

    // select the back camera index by default
    const backCameraIndex = foundCameras.findIndex(camera => 
        camera.label.toLowerCase().includes('back') ||
        camera.label.toLowerCase().includes('rear') ||
        camera.label.toLowerCase().includes('environment')
    );

    if(backCameraIndex > 0) {
      this._notifService.showSuccess("back camera index = " + backCameraIndex, 0);
      this.cameraIndex = backCameraIndex;
    }
  }

  noCamerasFound:boolean = false;

  camerasNotFoundHandler(): void {
    this.noCamerasFound = true;
  }

//****************************************
//*** SELECT FILE FOR SCAN FUNCTIONALITY
//****************************************

  async uploadImage(event: any): Promise<void> {  
    this.scanResult = "";

    const uploadedFile:File = event.target.files[0];      

    // 0. Validate file extension
    if(this.invalidFileExtension(uploadedFile.name)) {
      this._notifService.showError("File "+ uploadedFile.name +" is not supported. Only jpg, jpeg, png and bmp extensions are supported.",0);
      return;
    }

    // 1. Get the image and generate an URL for it 
    const handledFile: ImageFile = {
      file: uploadedFile,
      url: this.sanitizer.bypassSecurityTrustUrl( 
        window.URL.createObjectURL(uploadedFile)   
      )
    }

    // 2. Decode image
    const codeReader = new BrowserQRCodeReader();
    let resultFromQRCode!:string;
    
    try {
      resultFromQRCode = (await codeReader.decodeFromImageUrl(ɵunwrapSafeValue(handledFile.url))).getText();
    } catch (error) {
      return this._notifService.showError("Unsupported Code. Only QR Codes are supported", 0);
    }

    // 3. Verify the result string    
    this.scanResult = this.getProductIdentification(resultFromQRCode);
  }
  
//****************************************
//*** SELECT FILE VALIDATORS
//****************************************

  private invalidFileExtension(name: string): boolean {
    const extension = name.substring(name.lastIndexOf('.') + 1);

    switch(extension.toLowerCase()) {
      case 'png': return false;
      case 'jpg': return false;
      case 'jpeg': return false;
      case 'bmp': return false;

      default: return true;
    }
  } 

  private getProductIdentification(qrCode: string): string {
    if(qrCode.startsWith("hephaestus-washing-machine-")) {
      this._washingMachineDataService.getProductIdentification(qrCode).subscribe(response => {
        this.productIdentification = response;
        this._notifService.showSuccess("QR code succesfully identified!", 0);
      });
      return qrCode;
    } else {
      this._notifService.showError("The QR code does not belong to a supported washing machine. Scanned result: " + qrCode, 0);
      return "";
    }
  }

  uploadHelp: string = "* Only images with QR codes are supported. \n ** Only images with png, jpg, jpeg and bmp extension are supported";

}