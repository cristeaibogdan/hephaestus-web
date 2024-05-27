import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(
    private _authService: AuthService,
    private router: Router,
  ) { }

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
