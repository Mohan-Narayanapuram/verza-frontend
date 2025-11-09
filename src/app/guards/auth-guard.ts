import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';

declare var bootstrap: any; // allows Bootstrap toast JS usage

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isLoggedIn = !!localStorage.getItem('userEmail');

    if (!isLoggedIn) {
      // find the toast element in DOM and show it
      const toastEl = document.getElementById('loginToast');
      if (toastEl) {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
      }

      // redirect to login page after short delay
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);

      return false;
    }

    return true;
  }
}