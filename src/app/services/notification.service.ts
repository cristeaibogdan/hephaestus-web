import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  showError(errorMessage:string, displayDuration:number) {
    this.snackBar.open(errorMessage, 'X', 
    {
      duration: displayDuration,
      panelClass: 'notif-error'
    });
  }

  showSuccess(successMessage:string, displayDuration:number) {
    this.snackBar.open(successMessage, 'X', 
    {
      duration: displayDuration,
      panelClass: 'notif-success'
    });
  }

  showWarning(warningMessage:string, displayDuration:number) {
    this.snackBar.open(warningMessage, 'X', 
    {
      duration: displayDuration,
      panelClass: 'notif-warning'
    });
  }

//****************************
//*** BYTE64 CONVERTOR
// TODO: Find a place for it
//****************************

  base64ToArrayBuffer(base64:string):ArrayBuffer {
    const binary_string = atob(base64);
    const bytes = Uint8Array.from(binary_string, char => char.charCodeAt(0));
    return bytes.buffer;
  }
}