/**
 * Title:  Bob's Computer Repair Shop
 * Authors: Danial Purselley, William Watlington, Kayla McDanel
 * Date: 16 Feb 2023
 * Description: A web application for a computer repair shop
 */

// this has to be added to the 'providers' array of app.module.ts
import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        /**
         * handle the 404 error
         */
        if ([404].indexOf(err.status) !== -1) {
          this.router.navigate(["/session/404"]);
        }

        /**
         * handle 500 error reroute
         */
        if ([500].indexOf(err.status) !== -1) {
          this.router.navigate(["/session/500"]);
        }

        // catch and throw otherwise
        const error = {
          message: err.error.message || err.message,
          httpCode: err.error.httpCode || err.status,
          url: err.url,
        };

        console.log(
          `HttpInterceptor error; origin:${error.url}; message:${error.message}; httpCode:${error.httpCode}`
        );

        return throwError(() => error);
      })
    );
  }
}
