import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './angular-material.module';
import { DragAndDropDirective } from './directives/drag-and-drop.directive';
import { StepperButtonsDirective } from './directives/stepper-buttons.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { DateFormatMMYYYYDirective } from './directives/date-format-mm-yyyy.directive';
import { DateFormatSlashYYYYMMDDDirective } from './directives/date-format-slash-yyyy-mm-dd.directive';
import { DateFormatYYYYMMDDDirective } from './directives/date-format-yyyy-mm-dd.directive';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { PaginatorI18n } from './paginator.i18n';
import { ToLabelPipe } from './pipes/to-label.pipe';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { enUS } from 'date-fns/locale';
import { TranslocoRootModule } from './transloco-root.module';
import { MatPaginatorIntl } from '@angular/material/paginator';

@NgModule({
  declarations: [
    LanguageSelectorComponent   
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    TranslocoRootModule,

    ReactiveFormsModule,

    // PIPES
    ToLabelPipe,

    // DIRECTIVES
    DragAndDropDirective,
    StepperButtonsDirective
  ],
  exports: [
    CommonModule,
    AngularMaterialModule, 
    TranslocoRootModule,

    ReactiveFormsModule,

    LanguageSelectorComponent,

    // PIPES
    ToLabelPipe,

    // DIRECTIVES
    DragAndDropDirective,
    StepperButtonsDirective,
  ],
  providers: [     
    { // To be able to modify the datepicker format we need an adapter, hence DateFnsAdapter
      provide: DateAdapter, 
      useClass: DateFnsAdapter 
    },
    { provide: MAT_DATE_LOCALE, useValue: enUS },
    { // Custom translation of paginator from HistoryComponent
      provide: MatPaginatorIntl,
      useClass: PaginatorI18n
    }
  ],
})
export class SharedModule { }
