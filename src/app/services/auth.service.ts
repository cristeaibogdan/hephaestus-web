import { Injectable } from '@angular/core';
import { UserAccountDTO } from '../components/models/dtos/user-account.dto';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';
import { Router } from '@angular/router';
import { UserCredentialsDTO } from '../components/models/dtos/user-credentials.dto';

@Injectable({providedIn: 'root'})
export class AuthService { 

  isLoggedIn!:boolean;

  private loggedUser = new BehaviorSubject<UserAccountDTO>({
    code:'',
    organization:'',
    country:'',

    email:'',
    username:'',
    password:''
  });

  constructor(
    private _dataService: DataService,
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

  login(userCredentialsDTO: UserCredentialsDTO) { 
    this._dataService.login(userCredentialsDTO).subscribe((response:UserAccountDTO) => {
      this.isLoggedIn = true;
      this.loggedUser.next(response);

      this.router.navigate(["/home"]);
    });
  }
 
}
