import { Component } from '@angular/core';
import { Language, LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent {

  constructor(private _languageService: LanguageService) { }

  availableLanguages: Language[] = this._languageService.getAvailableLanguages();
  selectedLanguage: Language = this._languageService.getSelectedLanguage();

  changeLanguage(language:Language) {
    this._languageService.changeLanguage(language);
  }

}
