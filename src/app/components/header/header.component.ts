import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoginUserResponse } from '../../washing-machine/models/dtos/login-user.response';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { LanguageSelectorComponent } from 'src/app/shared/components/language-selector/language-selector.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    MatMenuModule,
    MatIconModule,

    RouterLink,
    CommonModule,
    TranslocoModule,
    LanguageSelectorComponent
  ]
})
export class HeaderComponent implements OnInit {

  constructor(
    private _authService: AuthService,
    private router: Router
  ) { }

  currentUser$!:Observable<LoginUserResponse>;

  ngOnInit(): void { 
    this.currentUser$ = this._authService.getCurrentUser();
  }

  logout(): void {
    this._authService.isLoggedIn = false;
    this.router.navigate(["/login"]);
  }
}
