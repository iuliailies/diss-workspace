import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { PATHS } from '../../app.constants';
import { AuthService } from '../../auth/shared/auth.service';
import { CookieService } from 'ngx-cookie-service';
import {filter} from "rxjs";
import {UserType} from "../../data-types/user.model";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.sass',
})
export class NavComponent implements OnInit{
  PATHS = PATHS;

  userName: any;
  userType: any;
  userDropdownOpened = false;
  showNav = false;
  hiddenRoutes = ['/login']

  constructor(
    private elementRef: ElementRef,
    public auth: AuthService,
    public router: Router,
    public cookieService: CookieService,
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.showNav = !this.hiddenRoutes.includes(this.router.url);
        this.userName = localStorage.getItem('userFirstname') + " " + localStorage.getItem('userLastname');
        this.userType = localStorage.getItem('userType');
      });
  }

  isAdmin() {
    return this.userType === UserType.ADMIN;
  }

  toggleUserDropdown(): void {
    this.userDropdownOpened = !this.userDropdownOpened;
  }

  getUserInitials() {
    return localStorage.getItem('userFirstname')!.charAt(0) + localStorage.getItem('userLastname')!.charAt(0);
  }

  logout(): void {
    this.cookieService.delete('Token');
    this.router.navigate(['/login']);
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    localStorage.removeItem('userInitials');
  }

  @HostListener('document:click', ['$event']) onDropdownBlur(
    e: MouseEvent,
  ): void {
    if (this.userDropdownOpened) {
      try {
        const userItem: HTMLElement =
          this.elementRef.nativeElement.querySelector('.user-icon');
        if (e.target === userItem || userItem.contains(e.target as Node)) {
          return;
        }
        this.userDropdownOpened = false;
      }
      catch (e) {
        this.userDropdownOpened = false;
        return;
      }
    }
  }
}
