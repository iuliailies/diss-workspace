import { Component } from '@angular/core';
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

  constructor(
    public auth: AuthService,
    public router: Router,
  ) {}

}
