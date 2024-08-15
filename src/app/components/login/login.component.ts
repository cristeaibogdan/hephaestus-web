import { Component } from '@angular/core';
import { Validators, NonNullableFormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserCredentialsDTO } from '../../washing-machine/models/dtos/user-credentials.dto';

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

  login() {
    if(this.loginForm.invalid) {
      return;
    }

    const userCredentialsDTO: UserCredentialsDTO = {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value
    };

    this._authService.login(userCredentialsDTO);
  }
}
