import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Language {
  flag: string,
  display: string,
  value: string
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languageList:Language[] = [
    {flag: "assets/images/country-flags/united-kingdom.png", display: "English (UK)", value: "EN"},
    {flag: "assets/images/country-flags/slovenia.png", display: "Slovenčina", value: "SL"},
    {flag: "assets/images/country-flags/spain.png", display: "Español", value: "ES"},
    {flag: "assets/images/country-flags/italy.png", display: "Italiano", value: "IT"},
    {flag: "assets/images/country-flags/romania.png", display: "Română", value: "RO"},
  ];
  private selectedLanguage = this.languageList[0];

  constructor(
    private _translateService: TranslateService
  ) {
    _translateService.setDefaultLang("EN");
  }

  getLanguageList() {
    return this.languageList;
  }

  getSelectedLanguage() {
    return this.selectedLanguage;
  }

  changeLanguage(language: Language) {
    this.selectedLanguage = language;
    this._translateService.use(language.value);
  }
}
