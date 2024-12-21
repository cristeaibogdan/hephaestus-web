import { HttpClient } from '@angular/common/http';
import {
  Translation,
  TranslocoLoader,
  TranslocoModule,
  provideTransloco
} from '@jsverse/transloco';
import { Injectable, NgModule, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string) {
      return this.http.get<Translation>(`./assets/i18n/${lang}.json`);
  }
}

@NgModule({
  exports: [ TranslocoModule ],
  providers: [
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
    })
  ]
})
export class TranslocoRootModule {}
