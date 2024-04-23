import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PATHS } from '../../app.constants';
import { AuthService } from '../../auth/shared/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.sass',
})
export class NavComponent {
  PATHS = PATHS;

  userDropdownOpened = false;

  constructor(
    private elementRef: ElementRef,
    public auth: AuthService,
    public router: Router,
    public cookieService: CookieService,
  ) {}

  toggleUserDropdown(): void {
    this.userDropdownOpened = !this.userDropdownOpened;
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
      const userItem: HTMLElement =
        this.elementRef.nativeElement.querySelector('.user-icon');
      if (e.target === userItem || userItem.contains(e.target as Node)) {
        return;
      }
      this.userDropdownOpened = false;
    }
  }
}
