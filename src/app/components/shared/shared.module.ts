import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './angular-material.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DragAndDropDirective } from './directives/drag-and-drop.directive';
import { StepperButtonsDirective } from './directives/stepper-buttons.directive';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';

export function createTranslateLoader(HttpBackend: HttpBackend) {
  return new TranslateHttpLoader(new HttpClient(HttpBackend), "./assets/i18n/", ".json")
}

@NgModule({
  declarations: [
    SpinnerComponent,
    LanguageSelectorComponent,
            
    DragAndDropDirective,
    StepperButtonsDirective,  
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,    
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpBackend]
      }
    }),
    
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    AngularMaterialModule,
    TranslateModule,    

    FormsModule,
    ReactiveFormsModule,    

    SpinnerComponent,
    LanguageSelectorComponent,

    DragAndDropDirective,
    StepperButtonsDirective,
  ]
})
export class SharedModule { }
