import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolarPanelComponent } from './components/solar-panel/solar-panel.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [{
  path: "", component: SolarPanelComponent
}];

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class SolarPanelModule { }
