import { Component } from '@angular/core';
import { Validators, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoginUserRequest } from '../../washing-machine/models/dtos/login-user.request';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { LanguageSelectorComponent } from 'src/app/shared/components/language-selector/language-selector.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,

    CommonModule,
    TranslocoModule,
    ReactiveFormsModule,
    LanguageSelectorComponent
  ]
})
export class LoginComponent {

  constructor(
    private fb: NonNullableFormBuilder,
    private _authService: AuthService
  ) {}

  loginForm = this.fb.group({
    username: ["", [Validators.required]],
    password: ["", [Validators.required, Validators.minLength(6)]]
  });

  login(): void {
    if(this.loginForm.invalid) {
      return;
    }

    const loginUserRequest: LoginUserRequest = {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value
    };

    this._authService.login(loginUserRequest);
  }
}
