import { Injectable } from '@angular/core';
import { AUTH_DATA, UserData } from './auth.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  data: UserData | null = null;
  authenticated: BehaviorSubject<boolean>;

  get isAuthenticated(): boolean {
    // const status = !!localStorage.getItem(AUTH_DATA);
    const status = true; // TODO: replace with the line above once authentication flow is implemented
    return status;
  }

  constructor() {
    this.authenticated = new BehaviorSubject<boolean>(this.isAuthenticated);
  }
}
