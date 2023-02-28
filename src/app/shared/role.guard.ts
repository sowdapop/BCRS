/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 26 Feb 2023
 * Description: A web application for a computer repair shop
 */

import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { map, Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { RoleService } from "../services/role.service";
import { Role } from "./models/role";

@Injectable({
  providedIn: "root",
})
export class RoleGuard implements CanActivate {
  // role variable set to type role, from our role interface
  role: Role;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private roleService: RoleService
  ) {
    // construct this.role as empty role object
    this.role = {} as Role;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.roleService
      .findUserRole(this.cookieService.get("sessionuser"))
      .pipe(
        map((res) => {
          // assign the res data to role variable
          this.role = res.data;
          // console f/ checks
          console.log("User role: " + this.role.text);
          console.log(this.role);
          // if statement to see if user role is an admin
          if (res.data.text === "admin") {
            return true;
          } else {
            // if user isn't an admin, redirect them home
            this.router.navigate(["/"]);
            return false;
          }
        })
      );
  }
}
