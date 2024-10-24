import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Language {
  flag: string,
  name: string,
  value: string
}

@Injectable({providedIn: 'root'})
export class LanguageService {
  private readonly LANGUAGE_STORAGE_KEY = "selectedLanguage";
  private readonly availableLanguages: Language[] = [
    {flag: "assets/images/country-flags/united-kingdom.png", name: "English (UK)", value: "EN"},
    {flag: "assets/images/country-flags/slovenia.png", name: "Slovenčina", value: "SL"},
    {flag: "assets/images/country-flags/spain.png", name: "Español", value: "ES"},
    {flag: "assets/images/country-flags/italy.png", name: "Italiano", value: "IT"},
    {flag: "assets/images/country-flags/romania.png", name: "Română", value: "RO"},
  ];
  private selectedLanguage: Language = this.getLanguageFromStorage();

  constructor(private _translateService: TranslateService) {
    this._translateService.setDefaultLang(this.availableLanguages[0].value);
    this._translateService.use(this.selectedLanguage.value);
  }

  private getLanguageFromStorage() {
    const savedLanguage = localStorage.getItem(this.LANGUAGE_STORAGE_KEY);    
    return this.availableLanguages.find(lang => lang.value === savedLanguage)
              || this.availableLanguages[0];
  }

  getAvailableLanguages() {
    return this.availableLanguages;
  }

  getSelectedLanguage() {
    return this.selectedLanguage;
  }

  changeLanguage(language: Language) {
    this.selectedLanguage = language;
    this._translateService.use(language.value);
    localStorage.setItem(this.LANGUAGE_STORAGE_KEY, language.value);
  }
}