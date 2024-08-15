import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BarcodeFormat } from '@zxing/library';
import { ɵunwrapSafeValue } from "@angular/core"
import { BrowserQRCodeReader } from '@zxing/browser/es2015/readers/BrowserQRCodeReader';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { MatDialogRef } from '@angular/material/dialog';
import { QrResult } from 'src/app/washing-machine/models/qr-result.model';
import { ImageFile } from 'src/app/washing-machine/models/image-file.model';
import { WashingMachineDataService } from 'src/app/washing-machine/services/washing-machine.data.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements AfterViewInit {

  constructor(
    private _washingMachineDataService:WashingMachineDataService, 
    private sanitizer:DomSanitizer,
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

cameraIsLoading:boolean = false;
cameraIsPaused:boolean = false;

onStart() {
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

ngAfterViewInit() {
  this.scanner.previewElemRef.nativeElement.onloadeddata = (event) => {
    this.cameraIsLoading = false;
  };
}

onScanSuccess(result:string) {
  this.scanResult = this.validateQrCodeResult(result);
  this.pauseScan(); 
   
  if(this.scanResult) {
    this._washingMachineDataService.openSnackBar_Success("QR code succesfully identified!", 0);
  }
}

pauseScan() {
  // A. change the format from QR CODE to something else, this way the onScanSuccess() won't be triggered anymore
  // workaround to stop from scanning continuously after pausing the video
  this.cameraIsPaused = true;
  this.allowedFormats = [BarcodeFormat.AZTEC];  
  this.scanner.previewElemRef.nativeElement.pause();  
}

resumeScan() {
  // B. change the format to QR CODE so onScanSuccess() can be triggered again
  this.cameraIsPaused = false;
  this.allowedFormats = [BarcodeFormat.QR_CODE];
  this.scanner.previewElemRef.nativeElement.play();  
}

onClose() {
  if (this.scanResult) {
    const qrResult:QrResult = {
      manufacturer: "Gorenje",
      model: "WA946",
      type: "GOR001",
      serialNumber: "QR_Code_"+Math.floor(Math.random() * 100)
    }
    return this.dialogRef.close(qrResult);
  }

  this.dialogRef.close();
}

//****************************************
//*** SELECT CAMERA FOR SCANNING
//****************************************

availableCameras!: MediaDeviceInfo[];
cameraIndex:number = 0;

onSwitch() {
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

camerasFoundHandler(foundCameras:MediaDeviceInfo[]) {  
  this.availableCameras = foundCameras;

  // select the back camera index by default
  const backCameraIndex = foundCameras.findIndex(camera => 
      camera.label.toLowerCase().includes('back') ||
      camera.label.toLowerCase().includes('rear') ||
      camera.label.toLowerCase().includes('environment')
  );

  if(backCameraIndex > 0) {
    this._washingMachineDataService.openSnackBar_Success("back camera index = "+backCameraIndex, 0);
    this.cameraIndex = backCameraIndex;
  }
}

noCamerasFound:boolean = false;

camerasNotFoundHandler() {
  this.noCamerasFound = true;
}

//****************************************
//*** SELECT FILE FOR SCAN FUNCTIONALITY
//****************************************

QRCodeFile!:ImageFile;

  async onFileSelectedQR(event: any) {  
    this.scanResult = "";

    const uploadedFile:File = event.target.files[0];      

    // 0. Validate file extension
    if(this.invalidFileExtension(uploadedFile.name)) {
      this._washingMachineDataService.openSnackBar_Error("File "+uploadedFile.name+" is not supported. Only jpg, jpeg, png and bmp extensions are supported.",0);
      return;
    }

    // 1. Get the image and generate an URL for it 
    const handledFile:ImageFile = {
      file: uploadedFile,
      url: this.sanitizer.bypassSecurityTrustUrl( 
        window.URL.createObjectURL(uploadedFile)   
      )
    }

    this.QRCodeFile = handledFile;

    // 2. Decode image
    const codeReader = new BrowserQRCodeReader();
    let resultFromQRCode!:string;
    
    try {
      resultFromQRCode = (await codeReader.decodeFromImageUrl(ɵunwrapSafeValue(handledFile.url))).getText();
    } catch (error) {
      this._washingMachineDataService.openSnackBar_Error("Unsupported Code. Only QR Codes are supported", 0);
      return;
    }

    // 3. Verify the result string    
    this.scanResult = this.validateQrCodeResult(resultFromQRCode);

    // 4. Send to backend to retrieve WashingMachine
    if(this.scanResult) {
      this._washingMachineDataService.openSnackBar_Success("QR code succesfully identified!", 0);
    }
  }
  
//****************************************
//*** SELECT FILE VALIDATORS
//****************************************

  private invalidFileExtension(name: String) {
    const extension = name.substring(name.lastIndexOf('.') + 1);

    switch(extension.toLowerCase()) {
      case 'png': return false;
      case 'jpg': return false;
      case 'jpeg': return false;
      case 'bmp': return false;

      default: return true;
    }
  } 

  private validateQrCodeResult(QRCodeResult:string) {
    // if(QRCodeResult.startsWith("400")) {
    if(QRCodeResult.startsWith("This")) {
      return QRCodeResult;
    } else {
      this._washingMachineDataService.openSnackBar_Error(
        "The QR code does not belong to a supported washing machine. Scanned result: "+QRCodeResult,0);
      return "";
    }
  }

  uploadHelp:string = "* Only images with QR codes are supported. \n ** Only images with png, jpg, jpeg and bmp extension are supported";

}
