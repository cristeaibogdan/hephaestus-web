import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpBackend, HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from './shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { GlobalErrorHandler } from './services/global-error-handler.service';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { languageInterceptor } from './interceptors/language.interceptor';
import { timeoutInterceptor } from './interceptors/timeout.interceptor';
import { CompositePropagatorModule, OpenTelemetryInterceptorModule, ZipkinExporterModule } from '@jufab/opentelemetry-angular-interceptor';
import { environment } from 'src/environments/environment';

export function createTranslateLoader(HttpBackend: HttpBackend) {
  return new TranslateHttpLoader(new HttpClient(HttpBackend), "./assets/i18n/", ".json")
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    
    RegisterComponent,
    LoginComponent,
  ],
  imports: [    
    SharedModule,

    BrowserModule,
    BrowserAnimationsModule,    

    AppRoutingModule,    
    HttpClientModule,

    TranslateModule.forRoot({ // Fix for translating lazy loaded modules https://stackoverflow.com/questions/51302703/ngx-translate-is-not-working-for-lazy-loaded-module
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpBackend]
      }
    }),

  // Zipkin tracing configuration start
    OpenTelemetryInterceptorModule.forRoot({
      commonConfig: {
        serviceName: 'hephaestus-web', // Service name sent in trace
        console: false, // Display trace in console
        probabilitySampler: '1', // 100% sampling
      },
      zipkinConfig: {
        url: environment.zipkinUrl, // URL of Zipkin
      }
    }),
    ZipkinExporterModule, // Handles export to Zipkin
    CompositePropagatorModule // Defines propagation in HTTP header
  // Zipkin tracing configuration end
  ],
  providers: [
    {
      provide: ErrorHandler, 
      useClass: GlobalErrorHandler
    },
    provideHttpClient(
      withInterceptors([
        timeoutInterceptor,
        languageInterceptor,
        loadingInterceptor
      ])
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
