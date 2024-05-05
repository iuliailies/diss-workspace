import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {parseJwt} from "../../utils/JWTParser";
import {UserType} from "../../data-types/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardAdminService {

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
    const jwt = parseJwt(token);
    if(jwt['type'] === UserType.ADMIN){
      return true;
    } else {
      this.router.navigate(['../notes']);
    }
    return false;
  }
}
