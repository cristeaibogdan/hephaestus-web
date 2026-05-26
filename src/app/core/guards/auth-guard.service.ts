import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthGuard  {
  private _authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    const isLoggedIn = this._authService.getIsLoggedIn()

    if(isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }   
  } 
}
