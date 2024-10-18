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
import { HistoryComponent } from './components/history/history.component';
import { HistoryViewComponent } from './components/history/history-view/history-view.component';

const routes: Routes = [
  { path: "", component: WashingMachineComponent },
  { path: "history", component: HistoryComponent }
];

@NgModule({
  declarations: [
    WashingMachineComponent,
    ProductIdentificationComponent,
    CameraComponent,
    ProductDamage,
    OverviewComponent,
    ProductRecommendationComponent,
    HistoryComponent,
    HistoryViewComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    ZXingScannerModule
  ],
})
export class WashingMachineModule { }
