import { CookieService } from 'ngx-cookie-service';
/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 11 Feb 2023
 * Description: A web application for a computer repair shop
 */

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router, private cookieService: CookieService) { }

  canActivate(
    route: ActivatedRouteSnapshot,state: RouterStateSnapshot) {
      const isAuthenticated = this.cookieService.get('sessionuser');
    
      if (isAuthenticated) {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
  }
}
