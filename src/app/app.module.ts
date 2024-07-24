import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { HttpBackend, HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageSelectorComponent } from './components/shared/language-selector/language-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { PaginatorI18n } from './angular-material/paginator.i18n';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';
import { WashingMachineComponent } from './components/washing-machine/washing-machine.component';
import { ProductIdentificationComponent } from './components/washing-machine/product-identification/product-identification.component';
import { ProductRecommendationComponent } from './components/washing-machine/product-recommendation/product-recommendation.component';
import { OverviewComponent } from './components/washing-machine/damage-overview/damage-overview.component';
import { StepperButtonsDirective } from './components/shared/directives/stepper-buttons.directive';
import { HistoryComponent } from './components/shared/history/history.component';
import { HistoryViewComponent } from './components/shared/history/history-view/history-view.component';
import { A11yModule } from '@angular/cdk/a11y';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateFormatYYYYMMDDDirective } from './components/shared/directives/date-format-yyyy-mm-dd.directive';
import { DateFormatSlashYYYYMMDDDirective } from './components/shared/directives/date-format-slash-yyyy-mm-dd.directive';
import { DateFormatMMYYYYDirective } from './components/shared/directives/date-format-mm-yyyy.directive';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CameraComponent } from './components/camera/camera.component';
import { DragAndDropDirective } from './components/shared/directives/drag-and-drop.directive';
import { ProductDamage } from './components/washing-machine/product-damage/product-damage.component';

export function createTranslateLoader(HttpBackend: HttpBackend) {
  return new TranslateHttpLoader(new HttpClient(HttpBackend), "./assets/i18n/", ".json")
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    LanguageSelectorComponent,
    RegisterComponent,
    LoginComponent,
    SpinnerComponent,
    WashingMachineComponent,
    ProductIdentificationComponent,
    ProductRecommendationComponent,
    ProductDamage,

    OverviewComponent,
    HistoryComponent,
    HistoryViewComponent,
    CameraComponent,
    
    // DIRECTIVES
    StepperButtonsDirective,
    DragAndDropDirective,
    DateFormatYYYYMMDDDirective,
    DateFormatSlashYYYYMMDDDirective,
    DateFormatMMYYYYDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    A11yModule,
    AppRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ZXingScannerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpBackend]
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi:true
    },
    { 
      provide: DateAdapter, 
      useClass: MomentDateAdapter, 
      deps: [MAT_DATE_LOCALE] 
    },
    {
      provide: MatPaginatorIntl,
      useClass: PaginatorI18n
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
