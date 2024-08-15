import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserAccountDTO } from '../../washing-machine/models/dtos/user-account.dto';

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

  currentUser$!:Observable<UserAccountDTO>;

  ngOnInit() { 
    this.currentUser$ = this._authService.getCurrentUser();
  }

  logout() {
    this._authService.isLoggedIn = false;
    this.router.navigate(["/login"]);
  }
}
