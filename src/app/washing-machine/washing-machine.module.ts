import { NgModule } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { RouterModule, Routes } from '@angular/router';
import { WashingMachineComponent } from './components/washing-machine.component';
import { ProductIdentificationComponent } from './components/product-identification/product-identification.component';
import { ProductDamage } from './components/product-damage/product-damage.component';
import { OverviewComponent } from './components/damage-overview/damage-overview.component';
import { ProductRecommendationComponent } from './components/product-recommendation/product-recommendation.component';
import { SharedModule } from '../shared/shared.module';
import { CameraComponent } from './components/product-identification/camera/camera.component';

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
