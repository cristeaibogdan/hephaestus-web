import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WashingMachineComponent } from './washing-machine.component';
import { OverviewComponent } from './damage-overview/damage-overview.component';
import { ProductDamage } from './product-damage/product-damage.component';
import { ProductIdentificationComponent } from './product-identification/product-identification.component';
import { ProductRecommendationComponent } from './product-recommendation/product-recommendation.component';
import { CameraComponent } from '../camera/camera.component';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { HttpBackend } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/app.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { DragAndDropDirective } from '../shared/directives/drag-and-drop.directive';
import { StepperButtonsDirective } from '../shared/directives/stepper-buttons.directive';


@NgModule({
  declarations: [
    WashingMachineComponent,
    ProductIdentificationComponent,
    ProductDamage,
    OverviewComponent,
    ProductRecommendationComponent,
    CameraComponent,

    // drag and drop directive for camera
    DragAndDropDirective,
    StepperButtonsDirective,

    // for loading spinner - to be moved in a shared module
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,

    // for translation
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpBackend]
      }
    }),

    // for forms
    ReactiveFormsModule,
    FormsModule,

    // for camera - to be removed from appmodule
    ZXingScannerModule,
  ],
  exports: []
})
export class WashingMachineModule { }
