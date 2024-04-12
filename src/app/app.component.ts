import { Component } from '@angular/core';
import { AuthService } from './auth/shared/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'diss-workspace';
  loggedIn: Observable<boolean>;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
    this.loggedIn = this.auth.authenticated.asObservable().pipe(untilDestroyed(this));
  }
}
