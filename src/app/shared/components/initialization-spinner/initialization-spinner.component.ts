import { Component, Inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-initialization-spinner',
  imports: [
    MatProgressSpinnerModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule
  ],
  templateUrl: './initialization-spinner.component.html',
  styleUrl: './initialization-spinner.component.scss'
})
export class InitializationSpinnerComponent { 
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {}
}