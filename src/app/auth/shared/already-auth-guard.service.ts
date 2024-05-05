import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import {CookieService} from "ngx-cookie-service";
import {parseJwt} from "../../utils/JWTParser";

@Injectable({ providedIn: 'root' })
export class AlreadyAuthGuardService {
  constructor(
    private cookieService: CookieService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    return this.authGuard();
  }

  private authGuard(): boolean {
    const token = this.cookieService.get('Token');
    if (token) {
      return true;
    } else {
      this.router.navigate(['../login']);
    }
    return false;
  }
}
