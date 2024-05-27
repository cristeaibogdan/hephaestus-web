import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language, LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent {

  constructor(
    private _languageService: LanguageService    
  ) { }

  languageList:Language[] = this._languageService.getLanguageList();
  selectedLanguage:Language = this._languageService.getSelectedLanguage();

  changeLanguage(language:Language) {
    this._languageService.changeLanguage(language);
  }

}
