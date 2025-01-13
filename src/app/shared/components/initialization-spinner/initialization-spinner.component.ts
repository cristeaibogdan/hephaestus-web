import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { map, take, timer } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-initialization-spinner',
  imports: [
    CommonModule,
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
  data: any = inject(MAT_DIALOG_DATA);

  private COUNTDOWN_TIME = 3 * 60;

  countdown$ = timer(0, 1000).pipe( // Starts immediately (0 delay) and emits every second
    take(this.COUNTDOWN_TIME + 1), // Emits 181 times (from 180 to 0)
    // Countdown in ms as the date pipe accepts only ms
    map((elapsedSeconds) => (this.COUNTDOWN_TIME - elapsedSeconds) * 1000) 
  );

}