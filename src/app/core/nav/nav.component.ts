import { Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { PATHS } from '../../app.constants';
import { AuthService } from '../../auth/shared/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.sass'
})
export class NavComponent {
  PATHS = PATHS;

  userDropdownOpened = false;

  constructor(
    private elementRef: ElementRef,
    public auth: AuthService,
    public router: Router,
  ) {}

  toggleUserDropdown(): void {
    this.userDropdownOpened = !this.userDropdownOpened;
  }

  logout(): void {

  }

  @HostListener('document:click', ['$event']) onDropdownBlur(e: MouseEvent): void {
    if (this.userDropdownOpened) {
      const userItem: HTMLElement = this.elementRef.nativeElement.querySelector('.user-icon');
      if (e.target === userItem || userItem.contains(e.target as Node)) {
        return;
      }
      this.userDropdownOpened = false;
    }
  }
}
