import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoginUserResponse } from '../../washing-machine/models/dtos/login-user.response';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private _authService: AuthService,
    private router: Router
  ) { }

  currentUser$!:Observable<LoginUserResponse>;

  ngOnInit() { 
    this.currentUser$ = this._authService.getCurrentUser();
  }

  logout() {
    this._authService.isLoggedIn = false;
    this.router.navigate(["/login"]);
  }
}
