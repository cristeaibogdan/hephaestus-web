import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-initialization-spinner',
  imports: [
    MatProgressSpinnerModule
  ],
  templateUrl: './initialization-spinner.component.html',
  styleUrl: './initialization-spinner.component.scss'
})
export class InitializationSpinnerComponent { }