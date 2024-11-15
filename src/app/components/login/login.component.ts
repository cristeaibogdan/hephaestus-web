import { Component } from '@angular/core';
import { Validators, NonNullableFormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoginUserRequest } from '../../washing-machine/models/dtos/login-user.request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
