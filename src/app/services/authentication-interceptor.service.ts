import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    console.log('Headers are set');
    if (!request.url.includes('/auth')) {
      const jwt = this.cookieService.get('Token');
      const headers: any = {'Authorization': jwt};
      request = request.clone({setHeaders: headers});
    }
    return next.handle(request);
  }
}
