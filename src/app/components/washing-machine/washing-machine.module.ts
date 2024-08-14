import { NgModule } from '@angular/core';
import { WashingMachineComponent } from './washing-machine.component';
import { OverviewComponent } from './damage-overview/damage-overview.component';
import { ProductDamage } from './product-damage/product-damage.component';
import { ProductIdentificationComponent } from './product-identification/product-identification.component';
import { ProductRecommendationComponent } from './product-recommendation/product-recommendation.component';
import { CameraComponent } from './product-identification/camera/camera.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: "", component: WashingMachineComponent
}];

@NgModule({
  declarations: [
    WashingMachineComponent,
    ProductIdentificationComponent,
    CameraComponent,
    ProductDamage,
    OverviewComponent,
    ProductRecommendationComponent  
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    ZXingScannerModule
  ],
})
export class WashingMachineModule { }
