import { ApplicationConfig, ErrorHandler, importProvidersFrom, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorI18n } from './shared/paginator.i18n';
import { enUS } from 'date-fns/locale';
import { provideTransloco } from '@jsverse/transloco';
import { environment } from 'src/environments/environment';
import { TranslocoHttpLoader } from './shared/transloco-http.loader';
import { CompositePropagatorModule, OpenTelemetryInterceptorModule, ZipkinExporterModule } from '@jufab/opentelemetry-angular-interceptor';
import { InitializationService } from "./features/initialization/initialization.service";
import { GlobalErrorHandler } from "./shared/services/global-error-handler.service";
import { timeoutInterceptor } from "./shared/interceptors/timeout.interceptor";
import { languageInterceptor } from "./shared/interceptors/language.interceptor";
import { loadingInterceptor } from "./shared/interceptors/loading.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideHttpClient(
      withInterceptors([
        timeoutInterceptor,
        languageInterceptor,
        loadingInterceptor,
      ])
    ),
    { // To be able to modify the datepicker format we need an adapter, hence DateFnsAdapter
      provide: DateAdapter,
      useClass: DateFnsAdapter
    },
    // { // Workaround not needed anymore, but kept for information purposes.
    //   // Workaround: Prevents black scrollbar issue when zoom is < 100% and a MatDialog is opened
    //   provide: MAT_DIALOG_SCROLL_STRATEGY,
    //   useFactory: () => {
    //     const overlay = inject(Overlay);
    //     return () => overlay.scrollStrategies.noop();
    //   }
    // },
    { provide: MAT_DATE_LOCALE, useValue: enUS },
    { // Custom translation of paginator from HistoryComponent
      provide: MatPaginatorIntl,
      useClass: PaginatorI18n
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    provideTransloco({
      config: {
        availableLangs: ['EN', 'ES', 'IT', 'RO', 'SL'],
        defaultLang: 'EN',
        fallbackLang: 'EN',
        missingHandler: {
          useFallbackTranslation: true // It will use the first language set in the `fallbackLang` property
        },
        reRenderOnLangChange: true, // Remove this option if your application doesn't support changing language in runtime.
        prodMode: environment.production,
      },
      loader: TranslocoHttpLoader
    }),

    provideAppInitializer(() => inject(InitializationService).wakeupBackends()),

    importProvidersFrom( // Zipkin tracing configuration
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
          urls: [
            /assets\/svgs\/.*/, // Ignore requests used to register svgs from assets/svgs
            /assets\/i18n\/.*/  // Ignore requests used to load translation files from assets/i18n
          ],
        },
      }),
      ZipkinExporterModule, // Handles export to Zipkin
      CompositePropagatorModule, // Defines propagation in HTTP header
    )
  ]
};
