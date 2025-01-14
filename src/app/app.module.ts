import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from './shared/shared.module';
import { GlobalErrorHandler } from './services/global-error-handler.service';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { languageInterceptor } from './interceptors/language.interceptor';
import { timeoutInterceptor } from './interceptors/timeout.interceptor';
import {
  CompositePropagatorModule,
  OpenTelemetryInterceptorModule,
  ZipkinExporterModule,
} from '@jufab/opentelemetry-angular-interceptor';
import { environment } from 'src/environments/environment';
import { InitializationService } from './services/initialization.service';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    RegisterComponent,
    LoginComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // Zipkin tracing configuration start
    OpenTelemetryInterceptorModule.forRoot({
      commonConfig: {
        serviceName: 'hephaestus-web', // Service name sent in trace
        console: false, // Display trace in console
        probabilitySampler: '1', // 100% sampling
      },
      zipkinConfig: {
        url: environment.zipkinUrl, // URL of Zipkin
      },
      ignoreUrls: {
        urls: [/assets\/svgs\/.*/], // Ignore requests used to register svgs from assets/svgs
      },
    }),
    ZipkinExporterModule, // Handles export to Zipkin
    CompositePropagatorModule, // Defines propagation in HTTP header
    // Zipkin tracing configuration end
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    provideHttpClient(
      withInterceptors([
        timeoutInterceptor,
        languageInterceptor,
        loadingInterceptor,
      ])
    ),

    // { // TODO: Migrate this to Angular 19 and test how it performs while deployed on GithubPages
    //   provide: APP_INITIALIZER,
    //   useFactory: (initService: InitializationService) => {
    //     return () => initService.wakeupBackends();
    //   },
    //   deps: [InitializationService],
    //   multi: true
    // }
  ],
})
export class AppModule {}
