import { Injectable } from '@angular/core';
import { LoginUserResponse } from '../washing-machine/models/dtos/login-user-response.dto';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { LoginUserRequest } from '../washing-machine/models/dtos/login-user-request.dto';
import { AuthDataService } from './auth.data.service';

@Injectable({providedIn: 'root'})
export class AuthService { 

  isLoggedIn!:boolean;

  private loggedUser = new BehaviorSubject<LoginUserResponse>({
    code:'',
    organization:'',
    country:'',

    email:'',
    username:''
  });

  constructor(
    private _authDataService: AuthDataService,
    private router: Router
  ) {}

  getIsLoggedIn() {
    return this.isLoggedIn;
  }

  getCurrentUser() {
    return this.loggedUser.asObservable();    
  }

  getEmail() {
    return this.loggedUser.value.email;
  }

  getUsername() {
    return this.loggedUser.value.username;
  }

  setEmail(email:string) {
    return this.loggedUser.value.email=email;
  }

  setUsername(username:string) {
    return this.loggedUser.value.username=username;
  }

  login(loginUserRequest: LoginUserRequest) { 
    this._authDataService.login(loginUserRequest).subscribe((response) => {
      this.isLoggedIn = true;
      this.loggedUser.next(response);

      this.router.navigate(["/home"]);
    });
  }
 
}