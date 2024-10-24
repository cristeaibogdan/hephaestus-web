import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './angular-material.module';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TranslateModule } from '@ngx-translate/core';
import { DragAndDropDirective } from './directives/drag-and-drop.directive';
import { StepperButtonsDirective } from './directives/stepper-buttons.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { DateFormatMMYYYYDirective } from './directives/date-format-mm-yyyy.directive';
import { DateFormatSlashYYYYMMDDDirective } from './directives/date-format-slash-yyyy-mm-dd.directive';
import { DateFormatYYYYMMDDDirective } from './directives/date-format-yyyy-mm-dd.directive';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorI18n } from './paginator.i18n';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  declarations: [
    SpinnerComponent,
    LanguageSelectorComponent,
    
    // DIRECTIVES
    DragAndDropDirective,
    StepperButtonsDirective,
    DateFormatYYYYMMDDDirective,
    DateFormatSlashYYYYMMDDDirective,
    DateFormatMMYYYYDirective
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,    
    TranslateModule,

    ReactiveFormsModule,

    A11yModule,
  ],
  exports: [
    CommonModule,
    AngularMaterialModule,
    TranslateModule,    

    ReactiveFormsModule,

    A11yModule,

    SpinnerComponent,
    LanguageSelectorComponent,

    // DIRECTIVES
    DragAndDropDirective,
    StepperButtonsDirective,   

    // DIRECTIVES USED BY HISTORY - that's why they are also exported
    DateFormatYYYYMMDDDirective,
    DateFormatSlashYYYYMMDDDirective,
    DateFormatMMYYYYDirective
  ],
  providers: [
    { // To be able to modify the datepicker format we need an adapter, hence MomentDateAdapter
      provide: DateAdapter, 
      useClass: MomentDateAdapter, 
      deps: [MAT_DATE_LOCALE] 
    },
    { // Custom translation of paginator from HistoryComponent
      provide: MatPaginatorIntl,
      useClass: PaginatorI18n
    }
  ],
})
export class SharedModule { }
