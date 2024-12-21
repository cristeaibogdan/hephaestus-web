import { Component } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { Language, LanguageService } from 'src/app/services/language.service';

@Component({
    selector: 'app-language-selector',
    templateUrl: './language-selector.component.html',
    styleUrls: ['./language-selector.component.scss'],
    standalone: false
})
export class LanguageSelectorComponent {
  constructor(private _languageService: LanguageService, private fb: NonNullableFormBuilder) { }

  availableLanguages: Language[] = this._languageService.getAvailableLanguages();
  selectedLanguage = this.fb.control(this._languageService.getSelectedLanguage());

  changeLanguage(language:Language): void {
    this._languageService.changeLanguage(language);
  }

}