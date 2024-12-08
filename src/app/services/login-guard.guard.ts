import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  GuardResult,
  MaybeAsync,
} from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class loginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated = this.isLoggedIn();
    if (!isAuthenticated) {
      this.router.navigate(['']); // Redirect to login if not authenticated
      return false;
    }
    return true;
  }
  private isLoggedIn(): boolean {
    //  check a token in local storage
    return !sessionStorage.getItem('token');
  }
}
