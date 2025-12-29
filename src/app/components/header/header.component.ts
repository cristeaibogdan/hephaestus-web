import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoginUserResponse } from "src/app/washing-machine/models/endpoints/login-user.endpoint";
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
  private _authService = inject(AuthService);
  private router = inject(Router);
  
  currentUser$!:Observable<LoginUserResponse>;

  ngOnInit(): void { 
    this.currentUser$ = this._authService.getCurrentUser();
  }

  logout(): void {
    this._authService.isLoggedIn = false;
    this.router.navigate(["/login"]);
  }
}
