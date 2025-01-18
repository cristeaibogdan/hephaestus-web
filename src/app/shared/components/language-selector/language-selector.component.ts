import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Language, LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  imports: [
    MatFormFieldModule,
    MatSelectModule,

    ReactiveFormsModule,
  ]
})
export class LanguageSelectorComponent {
  private _languageService = inject(LanguageService);
  private fb = inject(NonNullableFormBuilder);

  availableLanguages: Language[] = this._languageService.getAvailableLanguages();
  selectedLanguage = this.fb.control(this._languageService.getSelectedLanguage());

  changeLanguage(language:Language): void {
    this._languageService.changeLanguage(language);
  }

}