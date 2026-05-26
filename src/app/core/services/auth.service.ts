import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthDataService } from './auth.data.service';
import { LoginUserRequest, LoginUserResponse } from "../../features/authentication/models/endpoints/login-user.endpoint";

@Injectable({providedIn: 'root'})
export class AuthService {

  private _authDataService = inject(AuthDataService,);
  private router = inject( Router);

  isLoggedIn!:boolean;

  private loggedUser = new BehaviorSubject<LoginUserResponse>({
    code:'',
    organization:'',
    country:'',

    email:'',
    username:''
  });

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
