import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';

@Component({
  selector: 'app-initialization-spinner',
  imports: [
    MatProgressSpinnerModule,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './initialization-spinner.component.html',
  styleUrl: './initialization-spinner.component.scss'
})
export class InitializationSpinnerComponent { }