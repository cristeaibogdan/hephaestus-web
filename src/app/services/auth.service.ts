import { Injectable } from '@angular/core';
import { LoginUserResponse } from '../washing-machine/models/dtos/login-user.response';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoginUserRequest } from '../washing-machine/models/dtos/login-user.request';
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

  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  getCurrentUser(): Observable<LoginUserResponse> {
    return this.loggedUser.asObservable();    
  }

  getEmail(): string {
    return this.loggedUser.value.email;
  }

  getUsername(): string {
    return this.loggedUser.value.username;
  }

  setEmail(email:string): void {
    this.loggedUser.value.email=email;
  }

  setUsername(username:string): void {
    this.loggedUser.value.username=username;
  }

  login(loginUserRequest: LoginUserRequest): void { 
    this._authDataService.login(loginUserRequest).subscribe((response) => {
      this.isLoggedIn = true;
      this.loggedUser.next(response);

      this.router.navigate(["/home"]);
    });
  }
 
}