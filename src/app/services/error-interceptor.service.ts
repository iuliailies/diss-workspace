import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {NotificationType} from "../data-types/notification.model";
import {ErrorResponseModel} from "../data-types/error-response.model";
import {NotificationService} from "./notification.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private notificationService: NotificationService,
  ) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const errResponse: ErrorResponseModel = error.error as ErrorResponseModel;
        if (error.status === 401 && errResponse.errorMessage === 'Unable to process request due to an invalid token. Please retry or contact support if the issue persists.') {
          this.cookieService.delete('Token');
          localStorage.removeItem('userType');
          localStorage.removeItem('userId');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userFirstname');
          localStorage.removeItem('userLastname');
          localStorage.removeItem('userPoints');
          localStorage.removeItem('userLevel');
          this.router.navigate(['/login']);
          this.notificationService.notify({
            message: "Session ended. Please login in again!",
            type: NotificationType.error,
          });
          return throwError(() => new Error(error.message));

        }
        // Rethrow the error for other error types
        return throwError(() => error);
      }),
    );
  }
}

