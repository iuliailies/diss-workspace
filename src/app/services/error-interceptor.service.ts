import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private cookieService: CookieService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error.error.message === 'Token has expired') {

          this.cookieService.delete('Token');
          this.router.navigate(['/login']);

          return throwError(() => new Error(error.message));
        }
        // Rethrow the error for other error types
        return throwError(() => error);
      })
    );
  }
}
