import { NgModule } from '@angular/core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';

@NgModule({
  exports: [
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatStepperModule,
    MatSliderModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatDateFnsModule,
    MatSortModule
  ]
})
export class AngularMaterialModule { }
