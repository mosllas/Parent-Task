import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated = this.isLoggedIn();
    if (!isAuthenticated) {
      this.router.navigate(['/login']); // Redirect to login if not authenticated
      return false;
    }
    return true;
  }

  private isLoggedIn(): boolean {
    //  check a token in local storage
    return !!sessionStorage.getItem('token');
  }
}
